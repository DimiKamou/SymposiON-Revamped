# Porting the Hagia Sophia 537 museum to Unreal Engine 5

The request behind this project asked for Unreal Engine *if possible*. The
shipped version is web-based (Three.js) on purpose: it runs instantly in
any browser on any device, embeds in the SymposiON shell as an iframe game,
weighs a few hundred kilobytes, and needs no installer — the right
trade-off for a school platform. A UE5 build is the right choice when you
want photoreal materials, Lumen global illumination and a packaged
"kiosk" or VR experience. This document is the concrete recipe for that
port; the model in this folder is your dimensioned blueprint.

## 1. Project setup

- **Template**: `Games → First Person` (or `Blank` + a `Character` with a
  `FloatingPawnMovement` for a museum-walk feel), C++ optional — Blueprints
  suffice for everything here.
- **Rendering**: enable **Lumen** (GI + reflections), **Nanite** for all
  static meshes, `Virtual Shadow Maps`. Target 60 fps at 1440p on a
  mid-range GPU.
- **World scale**: UE units are centimetres. All numbers below are metres —
  multiply by 100.

## 2. Blockout — use these exact dimensions

Recreate the blockout with simple geometry first (BSP/modeling mode), then
replace piece by piece. Axis convention here: +X = east (apse), +Z = up.

| Element | Value (m) |
| --- | --- |
| Central square (dome bay) | 31.0 × 31.0, centre at origin |
| Main piers (×4) | 5.2 (x) × 5.6 (z), inner corners at (±15.5, ±14.3…±19.9) |
| Great-arch springing | y 24.3 |
| Great-arch crown / dome ring | y 39.8, ring radius 15.5 |
| Pendentives | sphere R = 15.5·√2 ≈ 21.92, centre (0, 24.3) |
| **First dome (537)** | spherical cap: rise 9.2 → radius ≈ 17.66, crown ≈ 49.0, ring of 40 windows y 39.8–42.7 |
| Semidomes E/W | R 15.5, centres (±15.5, 24.3), east one with 5 lights at its base |
| Exedrae (×4) | R 5.5, centres at ±54° on the semidome circles; conch springs 20.4; 2 porphyry columns each |
| Apse | R 4.9, centre x 30.2; conch springs 15.0; 3 windows; 7-tier synthronon |
| Ground colonnades N/S | 4 verd antique columns, shafts ⌀1.15, total h 9.6; 5 arches r 2.06; spandrel to gallery floor 13.2 |
| Gallery colonnades | 6 columns h 6.6; 7 arches r 1.47; great cornice 23.2 |
| Tympana windows | row of 7 (sill 24.6, 2.3×5.0) + row of 5 (sill 30.6, 2.1×4.6) |
| Aisles | to z ±30.6; two storeys; vault caps ≈ every 5.6 m |
| Nave length | west wall −31 … apse face +30.2 |
| Narthex / exonarthex | x −32.4…−38.2 / −39.6…−44.2, 9 bays, 9 doors (central Imperial Door 4.6 × 7.4) |
| Atrium | x −45.6…−88, half-width 24, stoas at z ±20.4, phiale at x −66 |
| Eye height | 1.7; walk 3.1 m/s, hurry 6.4 m/s |

Faster path: export the geometry straight out of this app — in the browser
console run a GLTFExporter over `HS.scene` (three.js ships one), then
import the `.glb` into UE and let Nanite eat it. You lose instancing but
gain a one-click blockout.

## 3. Materials (all native UE)

| Surface | Recipe |
| --- | --- |
| Gold smalti | `M_Gold_Mosaic`: metallic 0.9, roughness 0.32; tessera detail via a tiling normal+roughness map (make one in Substance/Krita: 2–3 cm cells, per-cell normal jitter). Add a subtle `Fresnel`-driven emissive (0.02) so vaults shimmer in shadow. |
| Proconnesian marble | grey-white base + banded veins; use UE's `Marble` starter or a triplanar noise; roughness 0.45 |
| Book-matched panels | one veined tile, mirrored UVs per panel pair |
| Verd antique / porphyry | dark green / imperial purple base with fleck masks |
| Silver (templon, ciborium) | metallic 1.0, roughness 0.25 |
| Lead roofs, banded brick | simple tiling maps; brick = 4 courses + ashlar band |

## 4. Lighting

- **Sun**: one `Directional Light` (movable), ~4 lux-equivalent, from the
  south-east, + `SkyAtmosphere` + `SkyLight` (real-time capture). Lumen
  bounces will fill the interior exactly the way the fake fill-lights do in
  the web build — delete-and-forget.
- **God rays**: `ExponentialHeightFog` with volumetric fog ON; give the sun
  a modest volumetric scattering intensity — the 40 dome windows will do
  the rest for free.
- **Polykandela**: one Blueprint (`BP_Polykandelon`) with an instanced ring
  of flame sprites + a single point light (radius ~12 m, warm 2200 K).
  Scatter ~20 of them per the layout in `js/lighting.js`. A `Day/Dusk`
  lever in the level Blueprint animates sun intensity vs. lamp intensity.

## 5. The museum layer

- Each of the 16 stations in `js/exhibits.js` becomes a
  `BP_ExhibitMarker`: a niagara light-pillar + numbered medallion sprite +
  sphere trigger. On overlap, show an UMG widget with the same title /
  subtitle / body strings (copy them straight from `HS.EXHIBITS` — they are
  already bilingual EN/ΕΛ).
- The exhibit index = a pause-menu UMG list; "travel" = `SetActorLocation`
  on the pawn using the `view` coordinates in the same file.
- Ambient audio: a looping ison drone + convolution reverb
  (`SubmixEffectConvolutionReverb` with a cathedral IR).

## 6. Packaging & delivery

- Desktop kiosk: package Win64 + Mac; ~1–2 GB with Nanite meshes.
- Web-like reach from UE: **Pixel Streaming** (host a GPU instance, embed
  the stream in an `<iframe>` in SymposiON — the shell integration in
  `launcher.js` would only need the stream URL instead of the local path).
- VR: enable the OpenXR plugin; the scale of this building in VR is the
  single most convincing argument for the UE port.

## 7. Suggested milestones

1. Blockout from the table above (or GLB import) — walkable in a day.
2. Nanite/Lumen material pass (gold + marbles).
3. Furnishings (templon, ambo, ciborium — model in Blender, ~2k tris each).
4. Polykandela + day/dusk lever.
5. Exhibit widgets + localization table.
6. Package / Pixel Streaming.
