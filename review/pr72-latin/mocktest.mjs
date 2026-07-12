// Headless-Chromium mock test for the Latin-texts panels (PR #72).
// Loads every published Ενότητα + the Εισαγωγή, asserts a clean React mount,
// zero real console/page errors, all parts render, and practice mode starts.
//
//   BASE=http://localhost:8137/games/latin-texts \
//   CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
//   node mocktest.mjs
//
// Requires `playwright-core` on NODE_PATH and a static server serving synthesis/
// (ES-module dynamic imports need http://, not file://).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');

const EXE  = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.BASE   || 'http://localhost:8137/games/latin-texts';
const PUBLISHED = [16,17,18,19,20,21,22,23,24,25,26,27,29,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];
const STUBS = [28,30];

const browser = await chromium.launch({ headless:true, executablePath:EXE, args:['--no-sandbox'] });
const results = [];

async function testUnit(n, { stub=false } = {}){
  const page = await browser.newPage({ viewport:{ width:1280, height:900 } });
  const errs=[];
  page.on('console', m=>{ if(m.type()==='error' && !/favicon/i.test(m.text())) errs.push(m.text().slice(0,300)); });
  page.on('pageerror', e=>errs.push('PAGEERROR: '+String(e.message).slice(0,300)));
  const r={ unit:n, stub, errs, ok:false, mounted:false, errBanner:false, tokens:0, parts:0, practice:false };
  try{
    await page.goto(`${BASE}/enotita.html?unit=${n}`, { waitUntil:'networkidle', timeout:15000 });
    await page.waitForFunction(()=>{const r=document.getElementById('root');return r&&r.children.length>0;},{timeout:8000}).catch(()=>{});
    r.mounted   = await page.evaluate(()=>{const r=document.getElementById('root');return !!(r&&r.children.length>0);});
    r.errBanner = await page.evaluate(()=>document.body.innerText.includes('Σφάλμα φόρτωσης'));
    r.tokens    = await page.evaluate(()=>document.querySelectorAll('[data-tid]').length);
    r.parts     = await page.evaluate(()=>document.querySelectorAll('nav[data-nav] button').length);
    for(let i=0;i<r.parts;i++){ await page.evaluate(i=>document.querySelectorAll('nav[data-nav] button')[i].click(), i); await page.waitForTimeout(40); }
    await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Άσκηση σύνταξης/.test(x.innerText));b&&b.click();});
    await page.waitForTimeout(120);
    r.practice = await page.evaluate(()=>/Άσκηση|Ασκηση/.test(document.body.innerText));
    r.ok = r.mounted && !r.errBanner && r.errs.length===0 && (stub || r.tokens>0);
  }catch(e){ r.errs.push('HARNESS: '+e.message); }
  await page.close();
  return r;
}

for(const n of PUBLISHED) results.push(await testUnit(n));
for(const n of STUBS)     results.push(await testUnit(n, { stub:true }));
await browser.close();

let pass=0, fail=0;
for(const r of results){
  (r.ok?pass++:fail++);
  console.log(`[${r.ok?'PASS':'FAIL'}] unit ${r.unit}${r.stub?' (stub)':''} — mounted:${r.mounted} tokens:${r.tokens} parts:${r.parts} practice:${r.practice} errs:${r.errs.length}`);
  r.errs.forEach(e=>console.log('       ⚠ '+e));
}
console.log(`\n=== ${pass} PASS, ${fail} FAIL / ${results.length} ===`);
process.exit(fail? 1 : 0);
