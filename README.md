![lucide-extended: filled and duotone icons](https://raw.githubusercontent.com/applifted/lucide-extended/main/.github/assets/cover.png)

# lucide-extended

Filled and duotone versions of [Lucide](https://lucide.dev) icons, for every framework Lucide supports. They use Lucide's icon names, so they sit alongside Lucide's outline icons.

[Browse the icons](https://lucideextended.applifted.work/) · [Figma](https://www.figma.com/community/file/1687600808552210747)

> Not affiliated with or endorsed by Lucide.

## Packages

| Logo | Package | Version | Links |
| ---- | ------- | ------- | ----- |
| <img src="https://lucide.dev/framework-logos/js.svg" alt="JavaScript logo" width="32"> | **`lucide-extended-js`** | [![npm](https://img.shields.io/npm/v/lucide-extended-js)](https://www.npmjs.com/package/lucide-extended-js) | [README](./packages/js/README.md) |
| <img src="https://lucide.dev/framework-logos/react.svg" alt="React logo" width="32"> | **`lucide-extended-react`** | [![npm](https://img.shields.io/npm/v/lucide-extended-react)](https://www.npmjs.com/package/lucide-extended-react) | [README](./packages/react/README.md) |
| <img src="https://lucide.dev/framework-logos/vue.svg" alt="Vue logo" width="32"> | **`lucide-extended-vue`** | [![npm](https://img.shields.io/npm/v/lucide-extended-vue)](https://www.npmjs.com/package/lucide-extended-vue) | [README](./packages/vue/README.md) |
| <img src="https://lucide.dev/framework-logos/svelte.svg" alt="Svelte logo" width="32"> | **`lucide-extended-svelte`** | [![npm](https://img.shields.io/npm/v/lucide-extended-svelte)](https://www.npmjs.com/package/lucide-extended-svelte) | [README](./packages/svelte/README.md) |
| <img src="https://lucide.dev/framework-logos/solid.svg" alt="Solid logo" width="32"> | **`lucide-extended-solid`** | [![npm](https://img.shields.io/npm/v/lucide-extended-solid)](https://www.npmjs.com/package/lucide-extended-solid) | [README](./packages/solid/README.md) |
| <img src="https://lucide.dev/framework-logos/preact.svg" alt="Preact logo" width="32"> | **`lucide-extended-preact`** | [![npm](https://img.shields.io/npm/v/lucide-extended-preact)](https://www.npmjs.com/package/lucide-extended-preact) | [README](./packages/preact/README.md) |
| <img src="https://lucide.dev/framework-logos/react-native.svg" alt="React Native logo" width="32"> | **`lucide-extended-react-native`** | [![npm](https://img.shields.io/npm/v/lucide-extended-react-native)](https://www.npmjs.com/package/lucide-extended-react-native) | [README](./packages/react-native/README.md) |
| <img src="https://lucide.dev/framework-logos/angular.svg" alt="Angular logo" width="32"> | **`lucide-extended-angular`** | [![npm](https://img.shields.io/npm/v/lucide-extended-angular)](https://www.npmjs.com/package/lucide-extended-angular) | [README](./packages/angular/README.md) |
| <img src="https://lucide.dev/framework-logos/astro.svg" alt="Astro logo" width="32"> | **`lucide-extended-astro`** | [![npm](https://img.shields.io/npm/v/lucide-extended-astro)](https://www.npmjs.com/package/lucide-extended-astro) | [README](./packages/astro/README.md) |
| <img src="https://lucide.dev/framework-logos/svg.svg" alt="SVG logo" width="32"> | **`lucide-extended-static`** | [![npm](https://img.shields.io/npm/v/lucide-extended-static)](https://www.npmjs.com/package/lucide-extended-static) | [README](./packages/static/README.md) |

Every package has the same icons and shares one version number. Each README covers installing, usage and props for that framework.

## Icons

- **1,515** filled
- **1,364** duotone

Not every Lucide icon has both styles yet, so the counts differ. An icon can have one style without the other.

[Browse and search them all](https://lucideextended.applifted.work/), and download any icon as an SVG. The same icons are in the [Figma file](https://www.figma.com/community/file/1687600808552210747) on Figma Community.

## Naming

The Lucide name in PascalCase, then `Filled` or `Duotone`. Files and deep imports use the kebab-case name with `-filled` or `-duotone`.

| Lucide name | Filled | Duotone | Deep import |
| --- | --- | --- | --- |
| `heart` | `HeartFilled` | `HeartDuotone` | `lucide-extended-react/heart-filled` |
| `circle-check` | `CircleCheckFilled` | `CircleCheckDuotone` | `lucide-extended-vue/circle-check-duotone` |

Lucide's aliases work too, with the same suffixes. When Lucide renames an icon, the old name stays as a deprecated alias, so `AlertCircleFilled` is the same icon as `CircleAlertFilled`.

## For agents

Search [`icons.json`](./icons.json) before choosing an icon. It is the full catalogue, so search it rather than reading it from top to bottom. Each entry has the Lucide `name`, a `label`, `tags`, `categories`, `aliases`, `useCases`, and the `variants` that ship (`filled`, `duotone`). `components` gives the exact export for each variant.

`heart` is `HeartFilled` and `HeartDuotone`. An icon can have one variant without the other. If the requested variant is missing, say so.

The same file is included in every published package.

## Planned

- A powerful search
- A Raycast extension

## Licence

ISC. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

The shapes are derived from [Lucide](https://github.com/lucide-icons/lucide) (ISC). Some of those are derived from [Feather](https://github.com/feathericons/feather) (MIT). Both notices are in the licence.

## Contributing

Icons are added as SVGs. The steps are in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Support

If the icons are useful to you, you can [buy us a coffee](https://buymeacoffee.com/applifted).
