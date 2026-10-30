# lucide-extended-js

Filled and duotone versions of [Lucide](https://lucide.dev) icons, as plain JavaScript. No framework needed.

[Browse the icons](https://lucideextended.applifted.work/) · [Figma](https://www.figma.com/community/file/1687600808552210747) · [npm](https://www.npmjs.com/package/lucide-extended-js)

> Not affiliated with or endorsed by Lucide.

## Install

```sh
npm install lucide-extended-js
```

Keep `lucide` for the outlines. ESM only.

## Usage

Each icon is plain data. `createElement` turns it into an `<svg>` element:

```js
import { createElement, HeartFilled, HeartDuotone } from 'lucide-extended-js'

document.body.append(
  createElement(HeartFilled),
  createElement(HeartDuotone, { size: 32, color: 'crimson' }),
)
```

Or put placeholders in your HTML and replace them with `createIcons`:

```html
<i data-lucide-extended="heart-filled"></i>
<i data-lucide-extended="heart-duotone" class="like"></i>
```

```js
import { createIcons, HeartFilled, HeartDuotone } from 'lucide-extended-js'

createIcons({ icons: { HeartFilled, HeartDuotone } })
```

`createIcons` only knows the icons you pass it, so only those end up in the bundle. It also takes `attrs` (options for every icon), `nameAttr` (default `data-lucide-extended`) and `root` (default `document`). Attributes on a placeholder are kept on its `<svg>`, and its classes are added after the others.

Each icon has its own file too:

```js
import HeartFilled from 'lucide-extended-js/heart-filled'
```

Only the icons you import end up in the bundle (tree-shakeable). Importing an icon doesn't need a DOM; `createElement` does.

## Options

`createElement(icon, options)` sets any other option as an attribute on the `<svg>` (`id`, `aria-label`, and so on), plus:

| Option | Type | Default | Applies to | Description |
| --- | --- | --- | --- | --- |
| `size` | `number \| string` | `24` | all | Width and height. |
| `color` | `string` | `'currentColor'` | all | Fill on filled icons. Outline on duotone icons. |
| `class` | `string` | | all | Added after the `applifted-icon` classes. |
| `secondaryColor` | `string` | the value of `color` | duotone | Colour of the backing shape. |
| `secondaryOpacity` | `number \| string` | `0.15` | duotone | Opacity of that shape. |

`strokeWidth` and `absoluteStrokeWidth` are accepted, so Lucide-shaped options type-check. Both are ignored. Duotone outlines stay at 2.

Filled icons have no `secondaryColor` or `secondaryOpacity`; TypeScript rejects them.

Every icon has the classes `applifted-icon` and `applifted-icon-<name>`, for example `applifted-icon-heart-filled`. Icons are decorative by default, with `aria-hidden="true"`. Pass `aria-label` or `aria-labelledby` when an icon needs a name, and `aria-hidden` is left off.

## Naming

The Lucide name in PascalCase, then `Filled` or `Duotone`: `heart` is `HeartFilled` and `HeartDuotone`, and the deep import is `lucide-extended-js/heart-filled`. In `createIcons` placeholders, use the kebab-case name: `heart-filled`.

Lucide's aliases work too, with the same suffixes. When Lucide renames an icon, the old name stays as a deprecated alias, so `AlertCircleFilled` is the same icon as `CircleAlertFilled`.

Not every Lucide icon has both styles yet. [`icons.json`](./icons.json), included in the package, lists every icon with its tags and the styles it has.

## Licence

ISC. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

The shapes are derived from [Lucide](https://github.com/lucide-icons/lucide) (ISC). Some of those are derived from [Feather](https://github.com/feathericons/feather) (MIT). Both notices are in the licence.

## Contributing

Icons are added as SVGs. The steps are in [CONTRIBUTING.md](https://github.com/applifted/lucide-extended/blob/main/CONTRIBUTING.md).

## Support

If the icons are useful to you, you can [buy us a coffee](https://buymeacoffee.com/applifted).
