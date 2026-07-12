// Schema validator for latin-texts units. Mirrors exactly what panel.js reads,
// so any WARN here = a real render crash or silently-empty part in the browser.
import { readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = process.argv[2];
const files = (await readdir(dir)).filter(f => /^unit\d+\.js$/.test(f))
  .sort((a,b)=>parseInt(a.match(/\d+/))-parseInt(b.match(/\d+/)));

let totalErr = 0, totalWarn = 0;
const REQ_ARRAYS = ['periods','nouns','adjectives','comparatives','pronouns','verbs','sos','alignment'];

function walkTok(kids, cb, unitErrs){
  if(!Array.isArray(kids)){ unitErrs.push('clause.kids not array'); return; }
  for(const t of kids){
    if(t && t.kids){ if(!t.type && !t.key) unitErrs.push('nested clause missing type/key'); walkTok(t.kids, cb, unitErrs); }
    else cb(t);
  }
}

for(const f of files){
  const num = parseInt(f.match(/\d+/));
  const errs=[], warns=[];
  let U;
  try{
    const m = await import(pathToFileURL(path.join(dir,f)).href);
    U = m.UNIT || m.default;
  }catch(e){ console.log(`✗ ${f}: IMPORT FAILED — ${e.message}`); totalErr++; continue; }
  if(!U){ console.log(`✗ ${f}: no UNIT export`); totalErr++; continue; }

  if(typeof U.number !== 'number') errs.push('U.number not a number');
  if(U.number !== num) warns.push(`U.number(${U.number}) != filename(${num})`);
  if(!U.title) warns.push('no title');
  if(U.dataVersion==null) warns.push('no dataVersion (localStorage cache-busting relies on it)');

  // required arrays — panel does (ready?u.X:[]).map(...) → undefined ⇒ crash
  for(const k of REQ_ARRAYS){
    if(!Array.isArray(U[k])) errs.push(`U.${k} missing/not-array (panel will crash render)`);
  }

  if(Array.isArray(U.periods)){
    if(U.periods.length===0) warns.push('periods empty');
    U.periods.forEach((p,i)=>{ if(!Array.isArray(p.kids)) errs.push(`periods[${i}].kids not array`); });
    // token-level walk: every non-plain token that has a role should have l
    const roles=new Set(); let verbCount=0, tokCount=0;
    U.periods.forEach(p=> p.kids && walkTok(p.kids, t=>{
      if(!t) { errs.push('null token'); return; }
      tokCount++;
      if(!t.plain && !('l' in t)) warns.push('token missing l (latin form)');
      if(t.r){ roles.add(t.r); if(/^Ρήμα/.test(t.r)) verbCount++; }
    }, errs));
    if(tokCount===0) warns.push('no tokens in periods');
    if(verbCount===0) warns.push('no verb (Ρήμα) token — practice "find verb" step will be empty');
  }

  // nouns[].groups[].items[].form
  (U.nouns||[]).forEach((kl,ki)=>{
    if(!('kl' in kl)) warns.push(`nouns[${ki}] no kl label`);
    if(!Array.isArray(kl.groups)) errs.push(`nouns[${ki}].groups not array`);
    else kl.groups.forEach((g,gi)=>{ if(!Array.isArray(g.items)) errs.push(`nouns[${ki}].groups[${gi}].items not array`); if(!('gender' in g)) warns.push(`nouns[${ki}].groups[${gi}] no gender`); });
  });
  (U.adjectives||[]).forEach((kl,ki)=>{ if(!Array.isArray(kl.items)) errs.push(`adjectives[${ki}].items not array`); });
  (U.comparatives||[]).forEach((kl,ki)=>{ if(!Array.isArray(kl.rows)) errs.push(`comparatives[${ki}].rows not array`); });
  (U.verbs||[]).forEach((sz,zi)=>{ if(!Array.isArray(sz.rows)) errs.push(`verbs[${zi}].rows not array`); if(!('syz' in sz)) warns.push(`verbs[${zi}] no syz`); });
  (U.alignment||[]).forEach((a,i)=>{ if(!('la' in a)||!('el' in a)) warns.push(`alignment[${i}] missing la/el`); });
  if(Array.isArray(U.alignment) && U.alignment.length===0) warns.push('alignment empty (Μετάφραση part blank)');
  if('transforms' in U && !Array.isArray(U.transforms)) errs.push('transforms present but not array');
  if('etymology' in U && !Array.isArray(U.etymology)) errs.push('etymology present but not array');

  totalErr += errs.length; totalWarn += warns.length;
  if(errs.length || warns.length){
    console.log(`${errs.length?'✗':'⚠'} ${f} (Εν.${U.number}) — ${errs.length} err, ${warns.length} warn`);
    errs.forEach(e=>console.log(`    ERR : ${e}`));
    warns.forEach(w=>console.log(`    warn: ${w}`));
  } else {
    console.log(`✓ ${f} (Εν.${U.number}) — nouns:${U.nouns.length} adj:${U.adjectives.length} comp:${U.comparatives.length} pron:${U.pronouns.length} verbs:${U.verbs.length} sos:${U.sos.length} align:${U.alignment.length}${U.transforms?' +transforms':''}${U.etymology?' +etym':''}`);
  }
}
console.log(`\n=== TOTAL: ${totalErr} errors, ${totalWarn} warnings across ${files.length} units ===`);
