# Unity WebGL — SymposiON integration

This folder embeds a **Unity WebGL** build as a SymposiON game and provides a
two-way message **bridge** between the SymposiON shell and the running Unity
instance. It follows the same "iframe game" pattern as `games/istoria` and
`games/symposion`, so Unity's heavy globals stay sandboxed inside the iframe.

```
games/unity/
  index.html        ← the host page loaded in the overlay iframe (bridge + loader)
  unity-config.js   ← EDIT THIS: point it at your Build/ files + receiver object
  Build/            ← drop your Unity WebGL export here (.loader.js/.data/.framework.js/.wasm)
  README.md
```

## How it launches

- **Tile:** `js/data.js` → `ENGINES` has a `Unity` tile (`launch:{fn:'openUnity'}`).
- **Manifest:** `js/manifest/unity.js` registers `SYN_GAMES.openUnity`
  (`overlay:'unity-overlay'`) + `SYN_LAUNCH_MAP` name→openFn entries.
- **Overlay:** `overlays/unity-overlay.html` is the full-screen shell with an
  empty `#unity-wrap`.
- **Launcher:** `js/unity-launcher.js` (eager) defines `openUnity()/closeUnity()`,
  injects the `<iframe src="games/unity/index.html">` into `#unity-wrap` on first
  open, and runs the parent side of the bridge as `window.UnityBridge`.

Open the app → **Game Panel** → **Unity** → **Start the game**. With no build
present you get a "Unity bridge connected" screen with a live bridge tester, so
the connection is demonstrable before you have a real build.

## Dropping in a build

1. In Unity: **File ▸ Build Settings ▸ WebGL ▸ Build**.
2. Copy the four outputs into `Build/`:
   `<name>.loader.js`, `<name>.data`, `<name>.framework.js`, `<name>.wasm`
   (extensions become `.data.gz`/`.wasm.gz` or `.br` if a compression fallback
   is enabled — match them exactly).
3. Set those file names in `unity-config.js`, plus `defaultReceiver` = the name
   of the GameObject in your scene that receives bridge calls.
4. Reopen the Unity game.

> `.wasm`/`.data` are large binaries and are **git-ignored** by default. Deploy
> them with the app (Firebase Hosting serves all of `synthesis/`) or a CDN.

## The bridge

Same-origin `postMessage` between the SymposiON shell (parent) and the Unity
host page (iframe). Envelope: `{ source, type, ... }` — `source:'symposion'`
downward, `source:'unity'` upward. Messages are pinned to `location.origin`.

### SymposiON → Unity  (`window.UnityBridge`, defined in `js/unity-launcher.js`)

```js
// Send a call into the running Unity scene:
//   unityInstance.SendMessage(gameObject, method, value)
UnityBridge.send('SymposionBridge', 'LoadLevel', '3');
UnityBridge.send('SymposionBridge', 'SetQuestions', { items: [...] }); // objects are JSON-stringified

// Calls made before Unity finishes loading are queued and flushed on ready.
```

On the Unity (C#) side, a MonoBehaviour on that GameObject receives them:

```csharp
public class SymposionBridge : MonoBehaviour {
    public void LoadLevel(string id)      { /* ... */ }
    public void SetQuestions(string json) { /* JsonUtility.FromJson<...>(json) */ }
}
```

### Unity → SymposiON

Add this Emscripten plugin to your Unity project at
`Assets/Plugins/WebGL/Symposion.jslib`:

```javascript
mergeInto(LibraryManager.library, {
  SymposionEmit: function (typePtr, dataPtr) {
    var type = UTF8ToString(typePtr);
    var data = UTF8ToString(dataPtr);
    if (window.SymposionBridge && window.SymposionBridge.emit) {
      window.SymposionBridge.emit(type, data);
    }
  }
});
```

Call it from C#:

```csharp
using System.Runtime.InteropServices;
public class SymposionOut : MonoBehaviour {
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")] private static extern void SymposionEmit(string type, string data);
#else
    private static void SymposionEmit(string type, string data) {}
#endif
    public void ReportScore(int n) { SymposionEmit("score", n.ToString()); }
    public void Finish()           { SymposionEmit("request-close", ""); }
}
```

Listen for those on the SymposiON side:

```js
UnityBridge.on('score',        d => console.log('score', d));   // d = "42" (raw string from Unity)
UnityBridge.on('request-close', () => closeUnity());
UnityBridge.on('*', (type, d) => {});                            // catch-all
window.addEventListener('unity:message', e => {                  // or via DOM event
  console.log(e.detail.type, e.detail.data);
});
```

The host page (`index.html`) also exposes convenience wrappers so you don't need
the `.jslib` for common events — from Unity's page context you can call
`window.SymposionBridge.score(42)` / `.levelDone(id)` / `.close()` directly.

### Lifecycle events emitted automatically

| type          | when                                             |
|---------------|--------------------------------------------------|
| `ready`       | host page bridge is up (before the build loads)  |
| `unity-ready` | `createUnityInstance` resolved (build running)   |
| `no-build`    | no `Build/` present — placeholder shown          |
| `unity-error` | the build failed to instantiate                  |

## Cross-origin builds

If you host the `.wasm`/`.data` on a **different** origin (e.g. a CDN), or embed
the whole host page cross-origin, relax the origin checks: set the parent origin
in `js/unity-launcher.js` and `PARENT_ORIGIN` in `index.html` to the specific
origins involved (never leave `'*'` in production).
