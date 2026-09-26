# CLAUDE.md

Project context for Claude Code. Read this before making changes.

## What this is

`lucide-extended-react` — a React icon package providing **filled** and **duotone** icon variants that use Lucide's icon names, so they sit alongside `lucide-react` rather than replacing it.

- **Not affiliated with or endorsed by Lucide.** Never imply otherwise in code, docs, package metadata or commit messages.
- Icon shapes are derived from Lucide (ISC). Lucide derives from Feather (MIT). Both notices must stay in `LICENSE` / `NOTICE`.

## Locked decisions

Do not revisit these without being asked.

| Item | Value |
| --- | --- |
| npm package | `lucide-extended-react` |
| Package naming | `lucide-extended-<framework>`, **unscoped** — e.g. `-react`, later `-vue`, `-svelte`, `-angular`. Chosen deliberately over `@applifted/…`; because an unscoped `lucide-*` name can look official, every package's `description` must end with "Not affiliated with or endorsed by Lucide." |
| GitHub org | `applifted` |
| Repo | `github.com/applifted/lucide-extended` — the single repo for development and release, and for every framework package |
| Suffixes | `Filled`, `Duotone` — full words, always at the end |
| Main import | `import { HeartFilled, HeartDuotone } from 'lucide-extended-react'` |
| Deep import | `import HeartFilled from 'lucide-extended-react/heart-filled'` |
| Module format | ESM only |
| Tree-shaking | One file per icon + `"sideEffects": false` |
| Licence | ISC |
| First version | `0.1.0` |
| Lucide version | `1.45.0` — pinned exactly as the `lucide-react` devDependency, and named in `NOTICE`. Bump both together. |
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

## Icon source format

Source of truth is `svg/filled/*.svg` and `svg/duotone/*.svg`, exported from Figma. Generated code is **not** committed.

Filenames are the bare Lucide name, kebab-case, **with no suffix**: `svg/filled/heart.svg`. The suffix is added during generation.

### Filled icons

One or more `<path fill="black">`. No strokes, no opacity below 1.

### Duotone icons

A mix of two kinds of path, and an icon may contain several pairs of them (see `music.svg`, which has two):

- **stroke path** — `fill="none" stroke="black" stroke-width="2"` — the primary outline
- **tint path** — `fill="black" opacity="0.15"` — a translucent backing shape

**Tint opacity is exactly `0.15` across all duotone icons.** This may become `0.20` in future; when it does, treat it as a deliberate **minor** release with a changelog entry, because it visibly changes every duotone icon already in use.

### Figma quirks to expect

- Every path carries a redundant `style="fill:black;fill-opacity:1;"` (or the stroke equivalent) alongside the real attribute. SVGO's `removeAttrs` strips it.
- Layer order is **not** consistent across files. The generator sorts tint paths before stroke paths; do not rely on Figma's export order.
- The user will not be editing the ~1,240 duotone files in Figma to fix ordering. Solve ordering in the build.

## Architecture

```
svg/filled/*.svg          source of truth (committed)
svg/duotone/*.svg         source of truth (committed)
scripts/constants.ts      TINT_OPACITY
scripts/lib.ts            SVGO config, classify(), parsing helpers
scripts/validate.ts       fails the build on bad source SVGs
scripts/generate.ts       SVG -> one .ts file per icon + src/index.ts
src/createIcon.ts         hand-written base component (the only hand-written src file)
src/icons/*.ts            GENERATED - git-ignored
src/index.ts              GENERATED - git-ignored
scripts/qa.ts             visual QA sheet -> qa/index.html (git-ignored); `npm run qa`
test/                     Vitest: rendering, names/counts, tree-shaking (the last needs dist/, so build first)
.github/workflows/        ci.yml (PRs), release.yml (Changesets + Trusted Publishing)
```

A separate test app lives outside this repo at `../icons-test` (Vite + React). It installs the package from a local `npm pack` tarball, or from npm once published, and has an Examples page and an All icons page for checking every icon with every prop.

Build order: `validate` → `generate` → `tsc`. Validation failures must stop the build.

### `classify()` is the single source of truth for path kinds

`'stroke' | 'tint' | 'fill'`, decided in that order (stroke wins over opacity). Both `validate.ts` and `generate.ts` must use it rather than re-deriving the logic — they have drifted before.

### What the generator strips

Generated icon nodes keep only `d`, `fillRule`, `clipRule`. Colour and opacity are **not** baked in — they come from the component's `color` / `secondaryColor` / `secondaryOpacity` props at render time. This is why re-exporting from Figma at a different tint opacity changes nothing on its own.

## Constraints

- **Tree-shaking is non-negotiable.** Never introduce a barrel file with side effects, never bundle icons into one file, never remove `"sideEffects": false`. There is a test that proves it; keep it passing.
- **`src/index.ts` contains re-exports only.**
- Filled icons must not accept `secondaryColor` / `secondaryOpacity` at the type level; duotone icons must.
- `createIcon.ts` accepts `strokeWidth` and `absoluteStrokeWidth` and ignores them, so Lucide-shaped props don't cause type errors.
- SVG class names are `applifted-icon` and `applifted-icon-<slug>`.
- Icons get `aria-hidden` unless an `aria-label` or `aria-labelledby` is passed.

## Git and history

One repo, `applifted/lucide-extended`, for development and release. There is no separate private dev repo, so everything pushed to it — every branch and PR — should be treated as public.

- Commits use **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- Commit author email must be the GitHub **noreply** address. Check with `git log --format='%ae' | sort -u` before any push.
- Run `gitleaks detect` (install with `brew install gitleaks`) before making the repo public.
- Never commit: `node_modules/`, `dist/`, `src/icons/`, `src/index.ts`, `.env*`, `*.fig`, `*.tgz`.
- Never commit a Figma personal access token. It goes in `.env` locally, GitHub Secrets in CI.

## Releasing

- **Changesets**, configured with GitHub changelog integration **off** and auto-commit **off** (both deliberate — auto-commit produces generic commit messages that pollute the history).
- Turn the GitHub changelog integration on only once the repo is public and releases run from CI.
- npm **Trusted Publishing** from GitHub Actions; no long-lived npm token.
- `prepublishOnly` runs build + tests + `publint` + `attw`.
- **A new package name's first publish must be manual** (`npm publish --provenance=false` from a logged-in machine): Trusted Publishing can only be configured on a package that already exists. Configure it afterwards on npmjs.com with `applifted` / `lucide-extended` / `release.yml`. Every future framework package goes through the same first step.
- Provenance only works from a **public** repo; CI releases need the repo public first.
- `npm publish --dry-run` fails in `attw --pack` (the dry-run flag stops attw's internal `npm pack` from writing the tarball). Known and harmless; `npm run check:package` on its own is the real check.
- `lucide-extended-react@0.1.0` is published (first release, done manually on 2026-09-26). An earlier `@applifted/lucide-extended-react@0.1.0` was published by mistake before the switch to the unscoped name and has been removed; never publish to or reference the scoped name.
- Next step: configure Trusted Publishing for `lucide-extended-react` on npmjs.com, after which all releases go through Changesets and CI.

## Before any release

- [ ] `npm run validate` passes on all source SVGs
- [ ] Tree-shaking test passes
- [ ] `publint` and `attw --pack . --profile esm-only` pass
- [ ] `npm pack --dry-run` lists only `dist/`, `LICENSE`, `NOTICE`, `README.md`, `package.json`
- [ ] Icon counts match Figma
- [ ] LICENSE carries both copyright notices; NOTICE names the pinned Lucide version
- [ ] README and the `package.json` `description` say "Not affiliated with or endorsed by Lucide"

## Open items

- Lucide-name validation (checking every filename exists in Lucide's icon set) — `lucide-react@1.45.0` is now pinned, but the check in `validate.ts` is not yet written.
- Duotone z-order between *overlapping same-kind* shapes is unsolved by the tint-first sort. `npm run qa` flags overlapping tints (`tint-overlap`) and stroked tints; open `qa/index.html#attention`. Fix per-icon in the source SVG, not in Figma. The sheet was clean at 0.1.0; `galaxy`, `key-round`, `palette`, `tag`, `tags` and `vault` carry an informational `stroked-dot` flag and were reviewed and accepted.
- Vue / Svelte / Angular packages are a later possibility — this is why the package is `lucide-extended-react`, not `lucide-extended`. They live in **this same repo** (one set of source SVGs, one validator), not in separate repos. When the second framework arrives, move to npm workspaces with `packages/<framework>/`; until then the React package stays at the repo root.