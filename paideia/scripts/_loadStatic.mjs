/* ────────────────────────────────────────────────────────────
   _loadStatic.mjs — read a bundled classic browser script (e.g.
   js/data.js, games/<id>/questions.js) in Node and capture its
   top-level `const` globals, without a build step.

   The site's data files are plain classic scripts: `const GRADES = …`,
   `const QUESTIONS = …`. They are not modules and export nothing, so we
   evaluate them in a throwaway `vm` context with browser stubs, then read
   the named bindings back out.
   ──────────────────────────────────────────────────────────── */
import { readFileSync } from 'fs';
import vm from 'vm';

export function loadGlobals(absPath, names) {
  const src = readFileSync(absPath, 'utf8');
  // Tolerant no-op proxy so a game.js with top-level DOM calls
  // (document.getElementById(...).addEventListener(...)) still runs far
  // enough to build its data globals (e.g. LYO_G/PATH_G/PAR_G) instead of
  // throwing. We only read the captured const bindings, never window/DOM.
  const NOOP = new Proxy(function () {}, {
    get(_t, p) { return p === 'readyState' ? 'complete' : p === 'length' ? 0 : p === Symbol.toPrimitive ? () => '' : NOOP; },
    apply() { return NOOP; }, construct() { return NOOP; },
    set() { return true; }, has() { return true; },
  });
  const ctx = {
    window: NOOP, document: NOOP, localStorage: NOOP, navigator: NOOP, location: NOOP,
    console, structuredClone: globalThis.structuredClone,
    setTimeout() {}, clearTimeout() {}, requestAnimationFrame() {}, addEventListener() {},
  };
  vm.createContext(ctx);
  // Append a capture IIFE in the SAME program scope so it can see the consts.
  const capture = `\n;(function(){ globalThis.__CAP = {}; `
    + names.map(n => `try{ globalThis.__CAP[${JSON.stringify(n)}] = (typeof ${n} !== 'undefined') ? ${n} : undefined; }catch(e){}`).join(' ')
    + ` })();`;
  vm.runInContext(src + capture, ctx, { filename: absPath });
  return ctx.__CAP || {};
}
