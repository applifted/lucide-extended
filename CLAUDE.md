# CLAUDE.md

Project context for Claude Code and other AI coding tools. Read this before making changes. Human contributors should start with `CONTRIBUTING.md`.

## What this is

`lucide-extended-react` — a React icon package providing **filled** and **duotone** icon variants that use Lucide's icon names, so they sit alongside `lucide-react` rather than replacing it.

- **Not affiliated with or endorsed by Lucide.** Never imply otherwise in code, docs, package metadata or commit messages.
- Icon shapes are derived from Lucide (ISC). Lucide derives from Feather (MIT). Both notices must stay in `LICENSE` / `NOTICE`.

## Locked decisions

Do not revisit these without being asked.

| Item | Value |
| --- | --- |
| npm packages | `lucide-extended-react`, `lucide-extended-react-native`, `lucide-extended-preact`, `lucide-extended-vue`, `lucide-extended-solid`, `lucide-extended-svelte`, `lucide-extended-astro`, `lucide-extended-angular`, `lucide-extended-js`, `lucide-extended-static` |
| Package naming | `lucide-extended-<framework>`, **unscoped**. Shipped: `-react`, `-js` (framework-free; not the bare `lucide-extended`), `-static`, `-preact`, `-vue`, `-solid`, `-svelte`. Added in Phase 4 (unreleased until the version PR): `-react-native`, `-astro`, `-angular`. Because an unscoped `lucide-*` name can look official, every package's `description` must end with "Not affiliated with or endorsed by Lucide." |
| Repo | `github.com/applifted/lucide-extended` — the single repo for development and release, and for every framework package. npm workspaces: one package per directory in `packages/<framework>/`; the private root is named `lucide-extended` and is never published |
| Versioning | **Fixed**: every package shares one version (Changesets `fixed` group). The version stands for the icon set |
| Release tags | `<name>@<version>`, e.g. `lucide-extended-react@0.4.1`. 0.4.0 and earlier used `v<version>` |
| JS API | Icon data exports (`{ slug, variant, nodes }`) plus `createElement(icon, options)` → `SVGSVGElement` and `createIcons({ icons })` for `<i data-lucide-extended="heart-filled">` placeholders, like `lucide`. Options are flat: the shared props plus any SVG attribute |
| Static outputs | `icons/<slug>.svg` per icon and alias, `sprite.svg` (`<symbol id="<slug>">`, no aliases) and SVG string exports (`HeartFilled`). Colours are `currentColor` and the tint opacity is baked in. No icon font: it can't represent duotone |
| Preact API | Function components via `h()` from `preact`, no `preact/compat`. Paint uses SVG attribute names (`stroke-width`), since Preact doesn't convert camelCase on SVG. `ref` reaches the `<svg>` on Preact 11 only (Preact 10 doesn't pass `ref` to function components), as in `lucide-preact`. Peer `preact >=10` |
| Vue API | `defineComponent(setup, { props })` with the props declared, so kebab-case works and filled icons don't leak secondary props as attributes; other attributes fall through to the `<svg>`. Peer `vue >=3.3`; type-level rejection of secondary props on filled icons needs Vue ≥ 3.4.20 |
| Solid API | Function components built with `Dynamic` from `solid-js/web` and `mergeProps`/`splitProps`, no JSX, so `tsc` alone builds it and `solid-js/web` picks its browser or server build: no `solid` export condition. Props are read through getters, never destructured, so they stay reactive. `ref` reaches the `<svg>`. Server output works with hydration. Peer `solid-js >=1.8` |
| Svelte API | Svelte 5 components shipped as `.svelte` source, built by `@sveltejs/package`: one hand-written `Icon.svelte`, and per icon a generated `<slug>.svelte` passing its nodes plus a `<slug>.ts` re-export (the shared module layout). Prop types live in `src/types.ts`. `class` uses Svelte's array/object form, hence peer `svelte >=5.16`. No `ref`. The Svelte tooling needs TypeScript 6, so the package has its own `typescript@6` devDependency, nested by npm; the root stays on TypeScript 7 |
| Angular API | Icon data exports (`{ slug, variant, nodes }`, as in `-js`) plus one standalone component on the `<svg>` itself, `LxIcon` (`<svg [lxIcon]="HeartFilled"></svg>`), like `@lucide/angular` — not one component per icon, and no wrapper element, so `class` and `aria-*` land on the `<svg>`. Signal inputs; `aria-label`/`aria-labelledby` are inputs too, so it knows when to drop `aria-hidden`. With one component, templates can't reject secondary inputs on filled icons at the type level; they have no effect there. Built with `ngc` in partial-Ivy mode, one file per icon (not ng-packagr's single FESM), so deep imports work; tests load `dist/` through JIT. `types`/`module`/`typesVersions` fallbacks serve apps on `moduleResolution: "node"` (Angular ≤ 17 templates). Peer `@angular/core >=17.1` (signal inputs; 17.0.0 fails, though the compiler declares minVersion 17.0.0). Compiler needs TypeScript 6, nested like Svelte's |
| Astro API | Ships TypeScript and `.astro` source (`src/`), like `@lucide/astro`; the site's Astro build compiles it. One hand-written `Icon.astro`, `createIcon.ts` (wraps it with `astro/compiler-runtime`) and `types.ts`; per icon a generated `.ts`. `build` is `astro check` (needs TypeScript 6, nested). Peer `astro >=4` (4.0.0 tested) |
| React Native API | `forwardRef` components rendering `Svg`/`Path` from `react-native-svg`, camelCase paint. `color` defaults to `'black'` (no inherited colour in React Native). No classes; accessibility uses native props (hidden unless `accessibilityLabel`/`aria-label`/`…LabelledBy`, then `accessible` + role `image`). `ref` reaches the `Svg`. Metro doesn't tree-shake, so docs recommend deep imports (root import adds ~2.5 MB). Deep imports need Metro package exports (default from RN 0.79 / Expo SDK 53; older: `unstable_enablePackageExports`). `main`/`types`/`typesVersions` fallbacks keep the root import and types working on older Metro and `moduleResolution: "node"` (tested on Expo SDK 49: RN 0.72, React 18.2, react-native-svg 13.9). Tests alias `react-native-svg` to a stub and read the element tree. Peers `react >=18`, `react-native-svg >=13` |
| Suffixes | `Filled`, `Duotone` — full words, always at the end |
| Main import | `import { HeartFilled, HeartDuotone } from 'lucide-extended-react'` |
| Deep import | `import HeartFilled from 'lucide-extended-react/heart-filled'` |
| Module format | ESM only |
| Tree-shaking | One file per icon + `"sideEffects": false` |
| Licence | ISC |
| Lucide version | `1.66.0` — pinned exactly as the `lucide-react` devDependency in the **root** `package.json`, and named in `NOTICE`. Bump both together. |
| Docs language | UK English |

### Naming rule

Component name = the icon's **Lucide name in PascalCase** + suffix.
`circle-check` → `CircleCheckFilled`, `CircleCheckDuotone`.

File slug = kebab name + kebab suffix: `circle-check-filled.ts`.

### Rejected approaches — do not reintroduce

- **A `variant` prop** (`<Heart variant="filled" />`) — breaks tree-shaking, since every variant of an icon gets bundled.
- **Subpath entry points** (`lucide-extended-react/filled`) — decided against; one import style only.
- **`icons/icons/…` deep-import paths** — the `exports` map exposes icons at the package root.
- **Drop-in replacement for `lucide-react`** — considered and deferred. If it ever happens it ships as a *separate* package (`lucide-extended-react-compat`), never as a second entry point here.
- **`Solid` instead of `Filled`** — considered, rejected to avoid confusion with SolidJS.
- **`Fill` / `Duo` short forms** — use the full words.
- **A scoped `@applifted/…` package name** — never publish to or reference a scoped name.

## Icon source format

Source of truth is `svg/filled/*.svg` and `svg/duotone/*.svg`, exported from Figma. Generated code is **not** committed. `icons.json` is generated from those SVGs and the pinned Lucide release's tags, categories, aliases, and use cases, and **is** committed so agents can search it without a build.

Filenames are the bare Lucide name, kebab-case, **with no suffix**: `svg/filled/heart.svg`. The suffix is added during generation.

### Filled icons

One or more `<path fill="black">`. No strokes, no opacity below 1.

### Duotone icons

A mix of two kinds of path, and an icon may contain several pairs of them (see `eighth-notes.svg`, formerly `music.svg`, which has two):

- **stroke path** — `fill="none" stroke="black" stroke-width="2"` — the primary outline
- **tint path** — `fill="black" opacity="0.15"` — a translucent backing shape

**Tint opacity is exactly `0.15` across all duotone icons.** This may become `0.20` in future; when it does, treat it as a deliberate **minor** release with a changelog entry, because it visibly changes every duotone icon already in use.

### Figma quirks to expect

- Every path carries a redundant `style="fill:black;fill-opacity:1;"` (or the stroke equivalent) alongside the real attribute. SVGO's `removeAttrs` strips it.
- Layer order is **not** consistent across files. The generator sorts tint paths before stroke paths; do not rely on Figma's export order.
- Duotone ordering is solved in the build, not by re-editing the ~1,240 source files in Figma.

## Architecture

```
svg/filled/*.svg          source of truth (committed)
svg/duotone/*.svg         source of truth (committed)
icons.json                Lucide metadata + source SVGs (committed; copied into each package)
scripts/constants.ts      TINT_OPACITY, and writeConstants() for emitters whose runtime needs it (src/constants.ts)
scripts/lib.ts            SVGO config, classify(), parsing helpers, toSvgAttrs()
scripts/modules.ts        writeIconModules(): the src/icons + alias re-exports + src/index.ts layout every emitter shares; iconSource()
scripts/icons.ts          loadIcons(): every icon parsed once, tint-first sorted, with its Lucide aliases
scripts/validate.ts       fails the build on bad source SVGs
scripts/catalogue.ts      writes icons.json; reads the pinned Lucide metadata (expanding its markers) for aliases and deprecations
scripts/generate.ts       icons.json, then for each packages/* (or those named: `npm run generate -- react`): emit.ts + LICENSE/NOTICE/icons.json copies
scripts/verify.ts         `npm run verify`: validate, generate twice (must be identical), build, test, package checks
scripts/qa.ts             visual QA sheet (uses packages/react) -> qa/index.html (git-ignored); `npm run qa`
test/                     repo-level Vitest: the shared icon model (icons.test.ts), icons.json, parity.test.ts (every icon renders the same SVG in every package; static is the reference) and parity.server.test.ts (the same for Solid's and Svelte's server render)
test/support/             shared test helpers: bundleFixture() and pathData() for each package's tree-shaking test
packages/<framework>/
  scripts/emit.ts         turns loadIcons() output into this framework's src/icons + src/index.ts
  src/createIcon.ts (react, react-native, preact, vue, solid), src/createElement.ts (js), src/Icon.svelte + src/types.ts (svelte), src/Icon.astro + src/createIcon.ts + src/types.ts (astro), src/icon.ts (angular)   hand-written runtime — the only hand-written src files; static has none
  src/icons (svelte: .svelte and .ts per icon), src/index.ts, src/constants.ts, LICENSE, NOTICE, icons.json   GENERATED - git-ignored
  icons/, sprite.svg      GENERATED (static only) - git-ignored
  README.md               committed, except react's, which is the root README copied by its emitter (git-ignored)
  test/                   Vitest: rendering, names/counts, tree-shaking (the last needs dist/, so build first). Solid and Svelte also check every icon's browser render against static, and run as two Vitest projects (browser and server builds). Astro, Angular and React Native check every icon against static in their own tests
.github/workflows/        ci.yml (PRs), release.yml (Changesets + Trusted Publishing, staged, loops over packages)
```

Build order (root `npm run build`): `validate` → `generate` → each workspace's `build`. Validation failures must stop the build. `npm run verify` runs the full pre-release check, including that generation is deterministic.

Emitters never parse SVGs or decide path kinds themselves — they only format `loadIcons()` output, and write their modules through `writeIconModules()` so every package has the same files, aliases and index. Icon data is inlined in each package; packages do not depend on each other at runtime.

The root `README.md` is the React package's README: the React emitter copies it into `packages/react` (git-ignored). Other packages have their own committed README.

### `classify()` is the single source of truth for path kinds

`'stroke' | 'tint' | 'fill'`, decided in that order (stroke wins over opacity). Both `validate.ts` and `icons.ts` must use it rather than re-deriving the logic — they have drifted before.

### What the generator strips

Generated icon nodes keep only `d`, `fillRule`, `clipRule`. Colour and opacity are **not** baked in — they come from the component's `color` / `secondaryColor` / `secondaryOpacity` props at render time. The exception is `-static`, which has no runtime: its emitter writes `currentColor` and `TINT_OPACITY` into the markup, so a tint change reaches it through `scripts/constants.ts` too. This is why re-exporting from Figma at a different tint opacity changes nothing on its own.

### Lucide renames and aliases

Follow Lucide exactly. When Lucide renames an icon, rename the source SVG to the new name. Every alias in the pinned release's metadata (e.g. `alert-circle` for `circle-alert`) is resolved once in `loadIcons()` (an alias that clashes with an icon name fails generation) and each package's emitter turns it into a `@deprecated` re-export, both in `src/index.ts` and as its own deep-import file (`alert-circle-filled.ts`), just as `lucide-react` does. An alias is the same component, so it renders the canonical class name. Aliases are never source SVGs.

Lucide also deprecates icons without renaming them (`deprecated` + `deprecationReason` in the metadata, e.g. the currency badges and receipts since 1.64.0). `loadIcons()` carries Lucide's reason text, `writeIconModules()` puts it in a `@deprecated` JSDoc on the icon's declaration, as `lucide-react` does, and `icons.json` records it as `deprecated`. The icon still ships until Lucide removes it.

Since 1.65.0 Lucide's metadata uses markers that its build expands: `$extends:<icon>` (in tags and categories: the parent's resolved values) and `$group:<name>` (in tags: `groups/<name>.json`). `catalogue.ts` expands them the same way (in place, first duplicate wins), so `icons.json` tags match `lucide-static`'s `tags.json`; it also expands `$extends:` in use cases, which Lucide doesn't.

## Constraints

- **Tree-shaking is non-negotiable.** Never introduce a barrel file with side effects, never bundle icons into one file, never remove `"sideEffects": false`. There is a test that proves it; keep it passing.
- **Each package's `src/index.ts` contains re-exports only.**
- Filled icons must not accept `secondaryColor` / `secondaryOpacity` at the type level; duotone icons must. Exception: Angular, whose one component can't tell them apart by type.
- Every runtime accepts `strokeWidth` and `absoluteStrokeWidth` and ignores them, so Lucide-shaped props don't cause type errors.
- Every package must pass `test/parity.test.ts`: the same SVG for every icon. Add each new package to it, or to `test/parity.server.test.ts` if it renders through a server build in Node (Solid, Svelte). Astro (needs its compiler), Angular (tests `dist/` via JIT) and React Native (no DOM; classes and `aria-hidden` excluded) run the same comparison in their package tests.
- SVG class names are `applifted-icon` and `applifted-icon-<slug>`.
- Icons get `aria-hidden` unless an `aria-label` or `aria-labelledby` is passed.

## Git

- Commits use **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- Never commit: `node_modules/`, `dist/`, `.svelte-kit/` (`svelte-package` scratch), `.astro/` (`astro check`), `packages/*/src/{icons,index.ts,constants.ts}`, the copied `packages/*/{LICENSE,NOTICE,icons.json}`, `packages/static/{icons,sprite.svg}`, `.env*`, `*.fig`, `*.tgz`, `CLAUDE.local.md`.
- Never commit a Figma personal access token. It goes in `.env` locally, GitHub Secrets in CI.

## Releasing

- **Changesets**, with auto-commit **off** (deliberate — auto-commit produces generic commit messages that pollute the history).
- **Staged publishing only.** The npm trusted publisher can `npm stage publish` but not `npm publish`; a maintainer approves each release on npmjs.com with 2FA. Do not switch the workflow back to `changeset publish` or tick "Allow npm publish" — both were considered and rejected for supply-chain safety.
- `changesets/action` only opens the Version packages PR (its version step, `npm run version-packages`, also refreshes `package-lock.json`); a separate step loops over every public workspace, stages its version and pushes a `<name>@<version>` tag, which marks it as staged so it isn't staged twice. A package not yet on npm is skipped with a warning: its first publish is manual (CONTRIBUTING.md). A package that fails to stage doesn't stop the others; the job fails at the end and a re-run skips what's already tagged. Staging needs npm ≥ 11.15.0.
- The release job runs `npm ci --ignore-scripts`. Keep it; the build is verified to work without install scripts.
- Each package's `prepublishOnly` runs the root build + its tests + `publint` + `attw`.
- `npm publish --dry-run` fails in `attw --pack` (the dry-run flag stops attw's internal `npm pack` from writing the tarball). Known and harmless; `npm run check:package` on its own is the real check.
- Maintainer release steps, including the first publish of a new framework package, are in `CONTRIBUTING.md`.

## Before any release

- [ ] `npm run validate` passes on all source SVGs
- [ ] Tree-shaking test passes
- [ ] `publint` and `attw --pack . --profile esm-only` pass
- [ ] `npm pack --dry-run` (in each package) lists only `dist/`, `icons.json`, `LICENSE`, `NOTICE`, `README.md`, `package.json`
- [ ] Icon counts match Figma
- [ ] LICENSE carries both copyright notices; NOTICE names the pinned Lucide version
- [ ] README and the `package.json` `description` say "Not affiliated with or endorsed by Lucide"

## Known limitations

- **Lucide-name validation** — checking every filename exists in Lucide's icon set against the pinned `lucide-react` — is not yet written in `validate.ts`.
- **Duotone z-order between overlapping same-kind shapes** is not solved by the tint-first sort. `npm run qa` flags overlapping tints (`tint-overlap`) and stroked tints; open `qa/index.html#attention`. Fix per-icon in the source SVG, not in Figma. The informational `stroked-dot` flag on `galaxy`, `key-round`, `palette`, `tag`, `tags` and `vault` is expected.
- **Every framework package** lives in **this same repo** as `packages/<framework>/`, built from one set of source SVGs and one validator, and honours the React contract: `size`, `color`, duotone-only `secondaryColor`/`secondaryOpacity`, ignored `strokeWidth`/`absoluteStrokeWidth`, the `applifted-icon` classes, and `aria-hidden` unless labelled. React Native has no classes and uses native accessibility props; Angular can't reject secondary inputs on filled icons by type.
