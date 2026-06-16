# Battle Royale — Implementation Prompt

Paste the prompt below into your AI coding assistant (or hand it to a developer) to wire this game into your **game panel**. The zip contains everything the game needs.

---

## What's in the zip (`battle/`)

| File | Role | Type |
|---|---|---|
| `Battle Royale.html` | Entry point — loads fonts, React, and all scripts | HTML |
| `styles.css` | All visual styling (Greek-arena theme) | CSS |
| `data.js` | The 24-warrior field, question pool, and bracket math | plain JS (`window.BR_DATA`) |
| `fx.js` | Sound + screen-shake effects | plain JS (`window.BR_FX`) |
| `tweaks-panel.jsx` | Settings panel controls | React (Babel) |
| `components.jsx` | Lobby, draw ceremony, duel arena, result, finale UI | React (Babel) |
| `spectator.jsx` | "Watch the rest of the bracket" view | React (Babel) |
| `app.jsx` | Tournament state machine that ties it all together | React (Babel) |

**Dependencies** are loaded from a CDN inside the HTML (React 18.3.1, ReactDOM, Babel Standalone). No build step is required — it runs as static files.

---

## The prompt to paste

> I have a self-contained browser game called **Battle Royale** (a Greek-arena trivia tournament). It is a set of static files: one `Battle Royale.html` entry point that loads `styles.css`, two plain-JS scripts (`data.js`, `fx.js`), and four Babel/JSX scripts (`tweaks-panel.jsx`, `components.jsx`, `spectator.jsx`, `app.jsx`). It mounts into `<div id="root"></div>` and pulls React + Babel from a CDN — there is no build step.
>
> I want to embed this game into a panel in my app **[describe your game panel here — e.g. a dashboard card, a modal, a route, an iframe slot]**. Please:
>
> 1. Copy the `battle/` folder into my project at **[path, e.g. `public/games/battle/`]** so the relative `src="data.js"` / `href="styles.css"` references keep resolving.
> 2. Embed it in my game panel. **Recommended:** use an `<iframe>` so the game's global scripts and styles stay sandboxed and don't collide with my app's React/CSS:
>    ```html
>    <iframe src="/games/battle/Battle Royale.html"
>            title="Battle Royale"
>            style="width:100%; height:100%; border:0;"
>            allow="autoplay"></iframe>
>    ```
> 3. Make sure the panel gives the iframe a real height (the game is responsive but needs a sized container — e.g. `min-height: 720px` or fill the panel).
> 4. If my app blocks CDN scripts (strict CSP), either allow `unpkg.com` in my Content-Security-Policy, or self-host React/ReactDOM/Babel and update the `<script src>` tags in `Battle Royale.html`.
>
> Do **not** try to merge the JSX files into my app's own React tree — they use in-browser Babel and global `window` exports, so the iframe approach is the clean integration.

---

## Notes & gotchas

- **Iframe is the safe path.** The JSX is transpiled in-browser via Babel and components are shared through `window`, so dropping the raw files into an existing React build will conflict. The iframe keeps it isolated.
- **Sound** is unlocked on first click (WebAudio policy) — expected browser behavior.
- **Settings** (answer time, rounds, opponent difficulty, your accent color) live in the in-game Tweaks panel and persist via the host; defaults are in `app.jsx` (`TWEAK_DEFAULTS`).
- **Going production / no CDN?** Run a one-time build that pre-compiles the `.jsx` with Babel and self-hosts React, so you can drop the `@babel/standalone` runtime. Ask your assistant for this if you need offline support.
- **Questions** are placeholder general-knowledge items in `data.js` (`QUESTION_POOL`) — swap them for your own `{ q, opts, ans }` entries.
