# lucide-extended-react

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

No changes in this release.

## 0.7.0

No changes in this release.

## 0.6.0

No changes in this release.

## 0.5.0

No changes in this release.

## 0.4.1

### Patch Changes

- 0936eed: Build the package from `packages/react` in a monorepo, ready for other frameworks. No change to the icons or the API.

## 0.4.0

### Minor Changes

- f4f9713: Add 23 filled and 23 duotone icons from Lucide 1.53.0 to 1.58.0
- 602b34b: Follow Lucide 1.58.0 in renaming the music icons. The old names still work as deprecated aliases:

  - `MusicFilled` / `MusicDuotone` → `EighthNotesFilled` / `EighthNotesDuotone`
  - `Music2Filled` / `Music2Duotone` → `EighthNoteFilled` / `EighthNoteDuotone`
  - `Music3Filled` / `Music3Duotone` → `HalfNoteFilled` / `HalfNoteDuotone`
  - `Music4Filled` / `Music4Duotone` → `SixteenthNotesFilled` / `SixteenthNotesDuotone`

  The old names now render the new class names, e.g. `applifted-icon-eighth-notes-filled` instead of `applifted-icon-music-filled`.

- 764c5c2: Export every Lucide alias with the `Filled` and `Duotone` suffixes, as in `lucide-react`. For example, `AlertCircleFilled` is the same component as `CircleAlertFilled`, and renders its class name, `applifted-icon-circle-alert-filled`. Aliases are marked `@deprecated` and also work as deep imports, such as `lucide-extended-react/alert-circle-filled`.
- 7d51512: Add 10 filled and 9 duotone icons from Lucide 1.60.0 and 1.61.0; now matches Lucide 1.61.0

## 0.3.0

### Minor Changes

- b7245a1: Add 14 filled and 11 duotone icons; now matches Lucide 1.52.0

## 0.2.0

### Minor Changes

- a9ff813: Ship icons.json, a searchable catalogue of every icon with Lucide's tags, categories and aliases

### Patch Changes

- a9ff813: Redraw 29 duotone icons:

  - `BookBookmarkDuotone`
  - `BookHeartDuotone`
  - `ChessPawnDuotone`
  - `CirclePlayDuotone`
  - `CircleStarDuotone`
  - `CircleStopDuotone`
  - `CircleUserDuotone`
  - `CircleUserRoundDuotone`
  - `CompassDuotone`
  - `ContactDuotone`
  - `ContactRoundDuotone`
  - `FileUserDuotone`
  - `FolderBookmarkDuotone`
  - `IdCardDuotone`
  - `IdCardLanyardDuotone`
  - `MessageCircleHeartDuotone`
  - `MessageSquareHeartDuotone`
  - `MonitorCloudDuotone`
  - `MonitorPlayDuotone`
  - `MonitorStopDuotone`
  - `ShieldUserDuotone`
  - `SquareBookmarkDuotone`
  - `SquarePlayDuotone`
  - `SquareSquareDuotone`
  - `SquareStarDuotone`
  - `SquareStopDuotone`
  - `SquareUserDuotone`
  - `SquareUserRoundDuotone`
  - `TvMinimalPlayDuotone`

## 0.1.0

### Minor Changes

- Initial release
