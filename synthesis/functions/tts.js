/* ════════════════════════════════════════════════════════════════════
   SymposiON — Neural Greek TTS  ·  Firebase Cloud Function (HTTPS)
   ────────────────────────────────────────────────────────────────────
   The Iris read-aloud (in "Iris Accessibility - Revamp.html") POSTs:
       { text, lang:"el-GR"|"en-US", voice, rate }
   and expects back:
       { audioContent: "<base64 mp3>" }     ← what this function returns
   If this endpoint is unreachable, Iris automatically falls back to the
   browser's built-in voice, so the app keeps working offline.

   AUTH  ·  This endpoint bills Google Cloud TTS per character, so it requires
   a verified Firebase ID token (Authorization: Bearer <token>) — without it,
   anyone could POST /api/tts and drain the project's TTS budget. A best-effort
   per-user rate limit (Firestore counter) caps abuse. Clients (Iris, Narration
   Studio) must attach the signed-in user's ID token when they call /api/tts.

   DEPLOY
     1.  cd functions && npm i @google-cloud/text-to-speech firebase-functions firebase-admin
     2.  Make sure Cloud Text-to-Speech API is enabled in your GCP project.
     3.  firebase deploy --only functions:tts
     4.  firebase.json (at the repo root) already rewrites /api/tts → this function.

   COST NOTE  ·  Google/Azure neural TTS bill per character. Iris caches
   each clip in-memory per session, but for fixed canonical texts (epics,
   exam passages) pre-generate the audio once and serve the file instead.
   ════════════════════════════════════════════════════════════════════ */

const functions = require('firebase-functions');
const textToSpeech = require('@google-cloud/text-to-speech');
const admin = require('firebase-admin');
// index.js already calls admin.initializeApp(); guard in case tts.js is loaded
// standalone (idempotent — never double-init).
if (!admin.apps.length) { try { admin.initializeApp(); } catch (_) {} }

const client = new textToSpeech.TextToSpeechClient();

// Best-effort per-user rate limit. The counter lives in grader_usage/* which is
// locked to Admin-SDK-only in firestore.rules. Returns false when over the cap.
async function _ttsRateOk(uid, limit = 120, windowMs = 3600000) {
  const ref = admin.firestore().doc('grader_usage/tts_' + uid);
  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = Date.now();
    let windowStart = now, count = 0;
    if (snap.exists) {
      const d = snap.data() || {};
      windowStart = d.windowStart || now;
      count = d.count || 0;
      if (now - windowStart >= windowMs) { windowStart = now; count = 0; }
    }
    if (count >= limit) return false;
    tx.set(ref, { windowStart, count: count + 1, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    return true;
  });
}

// Map the short codes Iris sends to real provider voice names.
const VOICE_MAP = {
  'el-GR-Wavenet-A': { languageCode: 'el-GR', name: 'el-GR-Wavenet-A' }, // Greek, female
  'el-GR-Standard-A': { languageCode: 'el-GR', name: 'el-GR-Standard-A' },
  'en-US-Neural2-C': { languageCode: 'en-US', name: 'en-US-Neural2-C' },
  'en-US-Wavenet-D': { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
};

exports.tts = functions
  .runWith({ memory: '256MB', timeoutSeconds: 20 })
  .https.onRequest(async (req, res) => {
    // CORS (same-origin via the /api/tts rewrite needs none, but allow for dev)
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Vary', 'Origin');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

    // ── AUTH: require a verified Firebase ID token (denial-of-wallet guard) ──
    // Cloud TTS bills per character; without this anyone could POST /api/tts and
    // drain the project budget. CORS does not stop non-browser callers — the
    // token does. Signed-out clients fall back to the browser voice.
    const m = (req.get('Authorization') || '').match(/^Bearer (.+)$/);
    if (!m) { res.status(401).json({ error: 'auth-required' }); return; }
    let caller;
    try { caller = await admin.auth().verifyIdToken(m[1]); }
    catch (_) { res.status(401).json({ error: 'auth-invalid' }); return; }
    try {
      if (!(await _ttsRateOk(caller.uid))) { res.status(429).json({ error: 'rate-limited' }); return; }
    } catch (_) { /* limiter unavailable → auth still enforced, proceed */ }

    try {
      const { text, lang = 'el-GR', voice, rate = 1 } = req.body || {};
      if (!text || typeof text !== 'string') { res.status(400).json({ error: 'missing text' }); return; }
      if (text.length > 600) { res.status(413).json({ error: 'text too long' }); return; }

      const picked = VOICE_MAP[voice] || { languageCode: lang };

      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice: picked,
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: Math.max(0.5, Math.min(1.5, Number(rate) || 1)),
        },
      });

      // 24h browser cache — identical lines never re-bill.
      res.set('Cache-Control', 'public, max-age=86400');
      res.json({ audioContent: response.audioContent.toString('base64') });
    } catch (err) {
      console.error('tts error', err);
      res.status(500).json({ error: 'tts failed' });
    }
  });

/* ────────────────────────────────────────────────────────────────────
   ALTERNATIVE · Azure Cognitive Services (often nicer Greek prosody)
   npm i microsoft-cognitiveservices-speech-sdk
   Set config:  firebase functions:config:set azure.key="..." azure.region="westeurope"
   ────────────────────────────────────────────────────────────────────
   const sdk = require('microsoft-cognitiveservices-speech-sdk');
   exports.ttsAzure = functions.https.onRequest(async (req, res) => {
     const { text, voice = 'el-GR-AthinaNeural', rate = 1 } = req.body || {};
     const cfg = sdk.SpeechConfig.fromSubscription(
       functions.config().azure.key, functions.config().azure.region);
     cfg.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3;
     const synth = new sdk.SpeechSynthesizer(cfg, null);
     const ssml = `<speak version="1.0" xml:lang="el-GR">
        <voice name="${voice}"><prosody rate="${(rate-1)*100}%">${text}</prosody></voice></speak>`;
     synth.speakSsmlAsync(ssml, result => {
       synth.close();
       const b64 = Buffer.from(result.audioData).toString('base64');
       res.set('Cache-Control', 'public, max-age=86400');
       res.json({ audioContent: b64 });
     }, err => { synth.close(); res.status(500).json({ error: String(err) }); });
   });
   ──────────────────────────────────────────────────────────────────── */
