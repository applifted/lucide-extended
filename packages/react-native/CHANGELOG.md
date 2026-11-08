# lucide-extended-react-native

## 0.10.0

### Minor Changes

- e4c1cc9: Add 11 filled and 10 duotone icons, from Lucide 1.67.0 to 1.70.0:

  - Lucide 1.67.0: `diagram-flow-horizontal`, `diagram-flow-vertical`, `globe-ban`, `globe-plus`
  - Lucide 1.68.0: `mango`
  - Lucide 1.69.0: `package-pen`, `package-question-mark`
  - Lucide 1.70.0: `moped`, `user-exclamation-point`, `user-round-exclamation-point`, and `grid-3x3-off` (filled only)

- d4c7fe2: Follow Lucide 1.70.0. Eleven icons take the `-exclamation-point` names Lucide gave them in 1.70.0. The old names still work as deprecated aliases:

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

### Patch Changes

- f8f2c2e: Redraw `ArchiveFilled`.

## 0.9.0

### Minor Changes

- 5da66f6: add 81 filled icons and 79 duotone icons
- 851d7fa: Follow Lucide 1.66.0. Seven icons take the names Lucide gave them in 1.63.0 and 1.64.0. The old names still work as deprecated aliases:

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

## 0.8.0

### Minor Changes

- 3c8d6da: Add three packages with the same icons as the others: `lucide-extended-react-native` for React Native with `react-native-svg` 13 and later, `lucide-extended-astro` for Astro 4 and later, and `lucide-extended-angular` for Angular 17.1 and later (`<svg [lxIcon]="HeartFilled">`).
