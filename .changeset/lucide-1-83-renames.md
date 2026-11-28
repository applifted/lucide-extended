---
'lucide-extended-react': minor
'lucide-extended-react-native': minor
'lucide-extended-preact': minor
'lucide-extended-vue': minor
'lucide-extended-solid': minor
'lucide-extended-svelte': minor
'lucide-extended-astro': minor
'lucide-extended-angular': minor
'lucide-extended-js': minor
'lucide-extended-static': minor
---

Follow Lucide 1.83.0. `rectangle-landscape-play` takes the name Lucide gave it in 1.81.0. The old name still works as a deprecated alias:

- `RectangleLandscapePlay…` → `RectangleHorizontalPlayFilled` / `RectangleHorizontalPlayDuotone`

The old name now renders the new class name, `applifted-icon-rectangle-horizontal-play-filled` instead of `applifted-icon-rectangle-landscape-play-filled`. In `lucide-extended-static`, the old `icons/rectangle-landscape-play-*.svg` files are still there, but `sprite.svg` has no aliases, so `#rectangle-landscape-play-filled` is now `#rectangle-horizontal-play-filled`.

`icons.json` takes its tags, categories and use cases from Lucide 1.83.0.
