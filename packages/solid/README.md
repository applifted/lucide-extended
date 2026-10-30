# lucide-extended-solid

Filled and duotone versions of [Lucide](https://lucide.dev) icons, for Solid.

[Browse the icons](https://lucideextended.applifted.work/) · [Figma](https://www.figma.com/community/file/1687600808552210747) · [npm](https://www.npmjs.com/package/lucide-extended-solid)

> Not affiliated with or endorsed by Lucide.

## Install

```sh
npm install lucide-extended-solid
```

Keep `lucide-solid` for the outlines. Solid 1.8 or later. ESM only.

## Usage

```tsx
import { HeartFilled, HeartDuotone } from 'lucide-extended-solid'

export function Example() {
  return (
    <>
      <HeartFilled />
      <HeartDuotone size={32} color="crimson" secondaryColor="pink" />
    </>
  )
}
```

Each icon has its own file too:

```tsx
import HeartFilled from 'lucide-extended-solid/heart-filled'
```

Only the icons you import end up in the bundle (tree-shakeable).

Icons work with server rendering and hydration. Props stay reactive: pass a signal (`size={size()}`) and the icon updates in place.

## Props

Icons take the usual SVG attributes (`class`, `style`, `onClick`, `aria-label`, and so on), plus:

| Prop | Type | Default | Applies to | Description |
| --- | --- | --- | --- | --- |
| `size` | `number \| string` | `24` | all | Width and height. |
| `color` | `string` | `'currentColor'` | all | Fill on filled icons. Outline on duotone icons. |
| `secondaryColor` | `string` | the value of `color` | duotone | Colour of the backing shape. |
| `secondaryOpacity` | `number \| string` | `0.15` | duotone | Opacity of that shape. |

`strokeWidth` and `absoluteStrokeWidth` are accepted, so Lucide-shaped props type-check. Both are ignored. Duotone outlines stay at 2.

Filled icons have no `secondaryColor` or `secondaryOpacity`; TypeScript rejects them.

`ref` goes to the `<svg>`. Every icon has the classes `applifted-icon` and `applifted-icon-<name>`, for example `applifted-icon-heart-filled`.

Icons are decorative by default, with `aria-hidden="true"`. Pass `aria-label` or `aria-labelledby` when an icon needs a name, and `aria-hidden` is left off.

## Naming

The Lucide name in PascalCase, then `Filled` or `Duotone`: `heart` is `HeartFilled` and `HeartDuotone`, and the deep import is `lucide-extended-solid/heart-filled`.

Lucide's aliases work too, with the same suffixes. When Lucide renames an icon, the old name stays as a deprecated alias, so `AlertCircleFilled` is the same component as `CircleAlertFilled`.

Not every Lucide icon has both styles yet. [`icons.json`](./icons.json), included in the package, lists every icon with its tags and the styles it has.

## Licence

ISC. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

The shapes are derived from [Lucide](https://github.com/lucide-icons/lucide) (ISC). Some of those are derived from [Feather](https://github.com/feathericons/feather) (MIT). Both notices are in the licence.

## Contributing

Icons are added as SVGs. The steps are in [CONTRIBUTING.md](https://github.com/applifted/lucide-extended/blob/main/CONTRIBUTING.md).

## Support

If the icons are useful to you, you can [buy us a coffee](https://buymeacoffee.com/applifted).
