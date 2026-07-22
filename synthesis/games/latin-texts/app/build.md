# Building panel.js

`app/panel.js` is compiled from `app/panel.jsx` (JSX → `React.createElement`).
The app serves `panel.js`, so **regenerate it whenever you edit `panel.jsx`**.

There is no bundler/build system to install — a one-liner with `@babel/standalone`
(the same library the Voyage games use) does it. From a machine with Node:

```bash
# from synthesis/games/latin-texts/
npm i @babel/standalone@7.29.0          # one-time, anywhere with npm
node -e "const B=require('@babel/standalone'),fs=require('fs');\
fs.writeFileSync('app/panel.js','/* AUTO-GENERATED from panel.jsx — do not edit. */\n'+\
B.transform(fs.readFileSync('app/panel.jsx','utf8'),{presets:['react'],filename:'panel.jsx'}).code)"
```

Only `panel.jsx` needs this. **Unit data files (`units/unitNN.js`) are plain data —
no compile step.** The vendored React runtime in `vendor/` never changes.
