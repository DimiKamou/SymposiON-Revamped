// ============================================================
//  SymposiON — Unity WebGL host configuration
//  Edit this ONE file when you drop a new Unity WebGL export into
//  games/unity/Build/. Nothing else in the integration needs to change.
//
//  A Unity WebGL "Build" export produces four files, all named after the
//  export's Build name (Player Settings → Build name, or the folder you
//  named when building):
//     <name>.loader.js      ← the small bootstrap (creates the instance)
//     <name>.data(.gz/.br)  ← assets / scenes
//     <name>.framework.js   ← the Unity/Emscripten runtime glue
//     <name>.wasm(.gz/.br)  ← the compiled code
//  Put those four inside games/unity/Build/ and set the names below.
//  If Unity was built with a compression fallback the extensions become
//  .data.gz / .wasm.gz (Gzip) or .data.br / .wasm.br (Brotli) — match them.
// ============================================================
window.UNITY_BUILD = {
  // File names RELATIVE to games/unity/ (the four Build outputs).
  loaderUrl:    'Build/symposion-unity.loader.js',
  dataUrl:      'Build/symposion-unity.data',
  frameworkUrl: 'Build/symposion-unity.framework.js',
  codeUrl:      'Build/symposion-unity.wasm',

  // Shown by the Unity template; harmless to leave as-is.
  streamingAssetsUrl: 'StreamingAssets',
  companyName:        'SymposiON',
  productName:        'SymposiON Unity',
  productVersion:     '1.0',

  // The Unity GameObject in your loaded scene that RECEIVES messages sent
  // from SymposiON via UnityBridge.send(...) when no explicit target is
  // given. Attach a MonoBehaviour with public string methods to it.
  // (See README.md → "Unity → SymposiON" for the receiver contract.)
  defaultReceiver: 'SymposionBridge',

  // Match the device-pixel scaling of the Unity build (1 = crisp, but
  // heavier on hi-dpi screens). 0 = let Unity decide.
  devicePixelRatio: 0
};
