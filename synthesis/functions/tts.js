/* ════════════════════════════════════════════════════════════════════
   SymposiON — Neural Greek TTS  ·  Firebase Cloud Function (HTTPS)
   ────────────────────────────────────────────────────────────────────
   The Iris read-aloud (in "Iris Accessibility - Revamp.html") POSTs:
       { text, lang:"el-GR"|"en-US", voice, rate }
   and expects back:
       { audioContent: "<base64 mp3>" }     ← what this function returns
   If this endpoint is unreachable, Iris automatically falls back to the
   browser's built-in voice, so the app keeps working offline.

   DEPLOY
     1.  cd firebase/functions && npm i @google-cloud/text-to-speech firebase-functions
     2.  Make sure Cloud Text-to-Speech API is enabled in your GCP project.
     3.  firebase deploy --only functions:tts
     4.  In firebase.json add a rewrite so /api/tts → this function
         (see firebase/firebase.json in this folder).

   COST NOTE  ·  Google/Azure neural TTS bill per character. Iris caches
   each clip in-memory per session, but for fixed canonical texts (epics,
   exam passages) pre-generate the audio once and serve the file instead.
   ════════════════════════════════════════════════════════════════════ */

const functions = require('firebase-functions');
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

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
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

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
