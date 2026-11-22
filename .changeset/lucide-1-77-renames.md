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

Follow Lucide 1.77.0. Four icons take the `-axis-` names Lucide gave them in 1.77.0. The old names, and the older `Flip…` aliases, still work as deprecated aliases:

- `TrianglesCenterlineDashedHorizontal…` → `CaretsToAxisDashedHorizontalFilled` / `CaretsToAxisDashedHorizontalDuotone`
- `TrianglesCenterlineDashedVertical…` → `CaretsToAxisDashedVerticalFilled` / `CaretsToAxisDashedVerticalDuotone`
- `SquareCenterlineDashedVertical…` → `SquareAxisDashedHorizontalFilled`
- `SquareCenterlineDashedHorizontal…` → `SquareAxisDashedVerticalFilled`

Lucide swapped the axis in the two square names: `square-centerline-dashed-vertical` is now `square-axis-dashed-horizontal`, and the reverse. The icons themselves are unchanged.

The old names now render the new class names, e.g. `applifted-icon-carets-to-axis-dashed-horizontal-filled` instead of `applifted-icon-triangles-centerline-dashed-horizontal-filled`. In `lucide-extended-static`, the old `icons/<slug>.svg` files are still there, but `sprite.svg` has no aliases, so `#triangles-centerline-dashed-horizontal-filled` and the other old symbol ids are now `#carets-to-axis-dashed-horizontal-filled` and so on.

`icons.json` takes its tags, categories and use cases from Lucide 1.77.0.
