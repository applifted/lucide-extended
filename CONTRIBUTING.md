# Contributing

## How the packages are built

The repo is an npm workspace. Each package lives in `packages/<framework>/` (today `react`, `js` and `static`), and all of them are built from the same source.

The source of truth is the SVG files in `svg/filled/` and `svg/duotone/`, exported from Figma. Each package's `src/icons/`, `src/index.ts`, `src/constants.ts` and `dist/`, its copies of `LICENSE`, `NOTICE` and `icons.json`, and the static package's `icons/` and `sprite.svg`, are generated and are not committed.

`icons.json` is also generated, from those SVGs plus the tags, categories, aliases, and use cases in the pinned Lucide release. It is committed, so it can be searched without a build. `npm run catalogue` rewrites it on its own. Commit the result when icon files change.

```sh
npm install
npm run validate   # check every source SVG; fails on any problem
npm run generate   # write icons.json, then every package's generated files
npm run generate -- react   # only the packages named
npm run build      # validate → generate → build every package
npm test           # run after build: the tree-shaking tests use dist/
npm run check:package   # publint and are-the-types-wrong, in every package
npm run verify     # all of the above, plus a check that generation is deterministic
```

`test/parity.test.ts` renders every icon in every package and checks they produce the same SVG, so a package can't drift from the others.

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

The duotone tint opacity is `0.15`, set in `scripts/constants.ts` and written into every package by `npm run generate`. Changing it visibly changes every duotone icon already in use, so it must go out as a deliberate **minor** release with a changelog entry.

## Releasing

Releases use [Changesets](https://github.com/changesets/changesets). Add a changeset with `npx changeset` in any pull request that changes a published package. All packages share one version, so a release bumps every package together. Publishing runs from GitHub Actions with npm Trusted Publishing and provenance, and every release waits for a maintainer's approval.

### For maintainers

- **How a release goes out:** merging the "chore: version packages" PR makes CI **stage** the new version on npm (`npm stage publish`) of each package and push a `<name>@<version>` git tag for each, such as `lucide-extended-react@0.4.1`. Versions up to 0.4.0 used `v<version>` tags. Nothing is live until a maintainer approves it under Staged Packages on npmjs.com, or with `npm stage approve <stage-id>`, with 2FA.
- **Rejecting a staged version:** reject it on npmjs.com, then delete its tag (`git push origin :refs/tags/<name>@<version>`). CI uses the tag to tell that a version is already staged, and won't stage it again while the tag exists.
- The release job installs dependencies with `npm ci --ignore-scripts`, so no dependency's install script runs in the job that can publish. If a new dependency needs its install script to build, find another way rather than removing the flag.
- `prepublishOnly` runs the build, the tests, `publint` and `attw`. `npm publish --dry-run` fails inside `attw --pack` because the dry-run flag stops its internal `npm pack` from writing a tarball; this is harmless, and `npm run check:package` is the real check.
- **First publish of a new package name** (for example `lucide-extended-vue`) must be done manually, because Trusted Publishing can only be configured on a package that already exists. The release job skips a package that isn't on npm yet and leaves a warning, so the other packages still stage:
  1. After the "chore: version packages" PR is merged, check out `main`, run `npm ci` and `npm run build` at the repo root, then from the package's directory (`packages/<framework>`), on a machine logged in to npm, run `npm publish --provenance=false`.
  2. The account requires staged publishing, so this stages the version rather than publishing it. Until the stage is approved, npm reserves the new name with a placeholder version, `0.0.0-stage`, which is also `latest`, so approve the stage on npmjs.com with 2FA straight away. Optionally deprecate the placeholder: `npm deprecate <name>@0.0.0-stage "Placeholder from staged publishing."`
  3. Tag it like CI does, one tag per package: `git tag <name>@<version> && git push origin <name>@<version>`.
  4. On npmjs.com, configure Trusted Publishing for the package with organisation `applifted`, repository `lucide-extended` and workflow `release.yml`. Leave **Allow npm publish** unticked, so the publisher can only stage.
  5. The Trusted Publisher shows "Pending validation" until CI stages the package with it, and lapses if that doesn't happen within about two days. If no release is due by then, check it before merging the next "chore: version packages" PR, and re-create it if it has lapsed. Running `npm stage publish` yourself doesn't validate it.
  6. All later releases go through Changesets and CI. If a package fails to stage, the release job still stages the others and then fails, naming the package; fix the cause and re-run the job.
