// Client-side security mock tests for the Latin-texts panel (PR #72).
//   1. PIN bypass — localStorage `latinAdmin=1` unlocks admin with no prompt.
//   2. Poisoned cache — malformed JSON in `latin-unit-16` must not crash.
//   3. XSS-as-data — a fully attacker-controlled cache must NOT execute HTML.
//
//   BASE=.../games/latin-texts CHROME=.../chrome node sec-mocktest.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');

const EXE  = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.BASE   || 'http://localhost:8137/games/latin-texts';
const URL  = `${BASE}/enotita.html?unit=16`;
const b = await chromium.launch({ headless:true, executablePath:EXE, args:['--no-sandbox'] });
let bad = 0;

// TEST 1 — PIN bypass (documents the known placeholder-pin weakness)
{
  const ctx=await b.newContext(); const p=await ctx.newPage();
  await p.addInitScript(()=>localStorage.setItem('latinAdmin','1'));
  await p.goto(URL,{waitUntil:'networkidle'}); await p.waitForTimeout(500);
  const adminOn=await p.evaluate(()=>[...document.querySelectorAll('button')].some(x=>/Εξαγωγή|PDF/.test(x.innerText)));
  console.log(`TEST1 PIN bypass via localStorage → admin unlocked without pin: ${adminOn} (expected true; local-only, no server impact)`);
  await ctx.close();
}
// TEST 2 — poisoned cache tolerated
{
  const ctx=await b.newContext(); const p=await ctx.newPage(); const errs=[];
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))errs.push(m.text());});
  await p.addInitScript(()=>localStorage.setItem('latin-unit-16','{not valid json'));
  await p.goto(URL,{waitUntil:'networkidle'}); await p.waitForTimeout(500);
  const mounted=await p.evaluate(()=>{const r=document.getElementById('root');return r&&r.children.length>0;});
  const ok = mounted && errs.length===0;
  console.log(`TEST2 malformed cache → mounts:${mounted} realErrs:${errs.length} → ${ok?'PASS':'FAIL'}`);
  if(!ok) bad++;
  await ctx.close();
}
// TEST 3 — XSS-as-data neutralised
{
  const ctx=await b.newContext(); const p=await ctx.newPage();
  let xss=false; p.on('dialog',d=>{xss=true;d.dismiss();});
  await p.addInitScript(()=>{
    const evil={number:16,dataVersion:2,title:'<img src=x onerror=alert(1)>',
      periods:[{n:1,kids:[{type:'main',key:'kyria',label:'K',kids:[{l:'<img src=x onerror=alert(2)>',r:'Ρήμα',d:'x'}]}]}],
      nouns:[],adjectives:[],comparatives:[],pronouns:[],verbs:[],sos:[],
      alignment:[{la:'<script>alert(3)<\/script>',el:'y'}]};
    localStorage.setItem('latin-unit-16', JSON.stringify(evil));
  });
  await p.goto(URL,{waitUntil:'networkidle'}); await p.waitForTimeout(700);
  const imgs=await p.evaluate(()=>document.querySelectorAll('#root img').length);
  const ok = !xss && imgs===0;
  console.log(`TEST3 XSS-as-data → alert:${xss} injectedImgs:${imgs} → ${ok?'PASS (escaped)':'FAIL'}`);
  if(!ok) bad++;
  await ctx.close();
}
await b.close();
console.log(`\n=== security mock tests: ${bad? bad+' FAIL':'all PASS'} ===`);
process.exit(bad? 1 : 0);
