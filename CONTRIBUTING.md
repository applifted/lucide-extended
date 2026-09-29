# Contributing

## How the package is built

The source of truth is the SVG files in `svg/filled/` and `svg/duotone/`, exported from Figma. Everything in `src/icons/`, `src/index.ts` and `dist/` is generated and is not committed.

```sh
npm install
npm run validate   # check every source SVG; fails on any problem
npm run generate   # write src/icons/*.ts and src/index.ts
npm run build      # validate → generate → compile to dist/
npm test           # run after build: the tree-shaking test uses dist/
npm run check:package   # publint and are-the-types-wrong
```

`npm run build` stops if validation fails. Fix the source SVG; do not loosen the validator.

## Adding or updating icons

### File names

- Use the icon's Lucide name in kebab-case, with **no suffix**: `svg/filled/heart.svg`, `svg/duotone/heart.svg`.
- The `-filled` / `-duotone` suffix and the component name (`HeartFilled`, `HeartDuotone`) are added during generation.

### Figma export rules

Every icon must be:

- on a **24 × 24** frame, exported with `viewBox="0 0 24 24"`
- made only of `<path>` elements — flatten shapes (⌘E) so circles, rectangles and lines export as paths
- free of `<g>` groups, `transform` attributes, `<mask>`, `<clipPath>`, `<text>`, `<image>`, `<use>` and `<filter>`
- exported with **"Clip content" turned off** on the frame, otherwise Figma wraps the icon in a clip path

**Filled icons:** one or more solid paths (`fill="black"`). No strokes and no opacity below 1.

**Duotone icons** mix two kinds of path, and may contain several of each:

- **Outline** — `fill="none" stroke="black" stroke-width="2"`
- **Tint** — `fill="black" opacity="0.15"`, a translucent backing shape

Each duotone icon needs at least one outline and at least one tint. Put the opacity on the **path itself**, not on a group, and do not give a tint path a stroke. Solid (fully opaque) filled paths are not allowed in duotone icons.

### Things you do not need to worry about

- **Layer order.** The build always draws tints behind outlines, whatever order Figma exports them in.
- **Colours and Figma's `style` attributes.** Colours and opacity are applied by the component at render time, and Figma's redundant `style="…"` attributes are stripped.

## Changing the tint opacity

The duotone tint opacity is `0.15`, set in `scripts/constants.ts` and mirrored in `src/createIcon.ts`. Changing it visibly changes every duotone icon already in use, so it must go out as a deliberate **minor** release with a changelog entry.

## Releasing

Releases use [Changesets](https://github.com/changesets/changesets). Add a changeset with `npx changeset` in any pull request that changes the published package. Publishing runs from GitHub Actions with npm Trusted Publishing and provenance.

### For maintainers

- `prepublishOnly` runs the build, the tests, `publint` and `attw`. `npm publish --dry-run` fails inside `attw --pack` because the dry-run flag stops its internal `npm pack` from writing a tarball; this is harmless, and `npm run check:package` is the real check.
- **First publish of a new package name** (for example a future `lucide-extended-vue`) must be done manually, because Trusted Publishing can only be configured on a package that already exists:
  1. From a machine logged in to npm, run `npm publish --provenance=false`.
  2. On npmjs.com, configure Trusted Publishing for the package with organisation `applifted`, repository `lucide-extended` and workflow `release.yml`.
  3. All later releases go through Changesets and CI.
