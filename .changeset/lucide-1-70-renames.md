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

Follow Lucide 1.70.0. Eleven icons take the `-exclamation-point` names Lucide gave them in 1.70.0. The old names still work as deprecated aliases:

- `BadgeAlert…` → `BadgeExclamationPointFilled` / `BadgeExclamationPointDuotone`
- `BatteryWarning…` → `BatteryExclamationPointFilled`
- `BookAlert…` → `BookExclamationPointFilled` / `BookExclamationPointDuotone`
- `CircleAlert…` → `CircleExclamationPointFilled` / `CircleExclamationPointDuotone`
- `MailWarning…` → `MailExclamationPointFilled` / `MailExclamationPointDuotone`
- `MessageCircleWarning…` → `MessageCircleExclamationPointFilled` / `MessageCircleExclamationPointDuotone`
- `MessageSquareWarning…` → `MessageSquareExclamationPointFilled` / `MessageSquareExclamationPointDuotone`
- `OctagonAlert…` → `OctagonExclamationPointFilled` / `OctagonExclamationPointDuotone`
- `SearchAlert…` → `SearchExclamationPointFilled` / `SearchExclamationPointDuotone`
- `ShieldAlert…` → `ShieldExclamationPointFilled` / `ShieldExclamationPointDuotone`
- `TriangleAlert…` → `TriangleExclamationPointFilled` / `TriangleExclamationPointDuotone`

The old names now render the new class names, e.g. `applifted-icon-circle-exclamation-point-filled` instead of `applifted-icon-circle-alert-filled`. In `lucide-extended-static`, the old `icons/<slug>.svg` files are still there, but `sprite.svg` has no aliases, so `#circle-alert-filled` and the other old symbol ids are now `#circle-exclamation-point-filled` and so on.

`icons.json` takes its tags, categories and use cases from Lucide 1.70.0.
