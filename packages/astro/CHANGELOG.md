# lucide-extended-astro

## 0.12.0

### Minor Changes

- f456fd9: Add 26 filled and 3 duotone icons that were already in Lucide (1.0.0 or earlier to 1.48.0):

  - Lucide 1.0.0 or earlier, filled only: `circle-check-big`, `cloud-backup`, `cloud-check`, `cloud-cog`, `cloud-download`, `cloud-drizzle`, `cloud-fog`, `cloud-hail`, `cloud-lightning`, `cloud-rain`, `cloud-rain-wind`, `cloud-snow`, `cloud-sync`, `external-link`, `funnel-plus`, `funnel-x`, `screen-share`, `screen-share-off`, `square-arrow-right-exit`, `square-check-big`
  - Lucide 1.0.0 or earlier, duotone only: `ban`
  - Lucide 1.29.0, filled only: `layer-arrow-down`, `layer-arrow-up`, `layers-arrow-down`, `layers-arrow-up`
  - Lucide 1.45.0: `globe-code`
  - Lucide 1.48.0: `line-dot-bottom-vertical`

## 0.11.0

### Minor Changes

- 339ffe4: Follow Lucide 1.73.0. Three icons gain the deprecated aliases Lucide added for them, as exports, deep imports and `lucide-extended-static` files:

  - `grid-3-x-2` for `grid-3x2`: `Grid3X2Filled` / `Grid3X2Duotone`
  - `grid-3-x-3-off` for `grid-3x3-off`: `Grid3X3OffFilled`
  - `printer-3-d` for `printer-3d`: `Printer3DFilled` / `Printer3DDuotone`

  `icons.json` takes its tags, categories and use cases from Lucide 1.73.0.

- 339ffe4: Add 23 filled and 7 duotone icons, from Lucide 1.71.0 to 1.73.0:

  - Lucide 1.71.0: `cheese`, and filled only: `square-arrow-down-enter`, `square-arrow-down-exit`, `square-arrow-down-left-enter`, `square-arrow-down-right-enter`, `square-arrow-left-enter`, `square-arrow-left-exit`, `square-arrow-up-enter`, `square-arrow-up-exit`, `square-arrow-up-left-enter`, `square-arrow-up-right-enter`, `stroke-line-cap-butt`, `stroke-line-cap-round`, `stroke-line-cap-square`, `stroke-line-join-bevel`, `stroke-line-join-miter`, `stroke-line-join-round`
  - Lucide 1.72.0: `mound-shovel`, `route-arrow-right`, `text-pen`
  - Lucide 1.73.0: `cap`, `graph-ring`, `layout-grid-plus`

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
