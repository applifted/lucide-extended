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

Follow Lucide 1.66.0. Seven icons take the names Lucide gave them in 1.63.0 and 1.64.0. The old names still work as deprecated aliases:

- `ArchiveRestore…` → `ArchiveArrowUpFilled` / `ArchiveArrowUpDuotone`
- `CircleParking…` → `CircleLetterPFilled` / `CircleLetterPDuotone`
- `CircleParkingOff…` → `CircleLetterPOffFilled`
- `Copyright…` → `CircleLetterCFilled` / `CircleLetterCDuotone`
- `SquareM…` → `SquareLetterMFilled` / `SquareLetterMDuotone`
- `SquareParking…` → `SquareLetterPFilled` / `SquareLetterPDuotone`
- `SquareParkingOff…` → `SquareLetterPOffFilled`

The old names now render the new class names, e.g. `applifted-icon-circle-letter-c-filled` instead of `applifted-icon-copyright-filled`. In `lucide-extended-static`, the old `icons/<slug>.svg` files are still there, but `sprite.svg` has no aliases, so `#copyright-filled` and the other old symbol ids are now `#circle-letter-c-filled` and so on.

Icons that Lucide has deprecated (the currency badges and receipts, such as `BadgeEuroFilled` and `ReceiptEuroDuotone`) are now marked `@deprecated` with Lucide's reason, and `icons.json` records it as `deprecated`. They still ship.

`icons.json` takes its tags, categories and use cases from Lucide 1.66.0, with Lucide's new `$extends:` and `$group:` markers expanded, so tags match Lucide's own.
