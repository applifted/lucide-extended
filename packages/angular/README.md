# lucide-extended-angular

Filled and duotone versions of [Lucide](https://lucide.dev) icons, for Angular.

[Browse the icons](https://lucideextended.applifted.work/) · [Figma](https://www.figma.com/community/file/1687600808552210747) · [npm](https://www.npmjs.com/package/lucide-extended-angular)

> Not affiliated with or endorsed by Lucide.

## Install

```sh
npm install lucide-extended-angular
```

Keep `@lucide/angular` for the outlines. Angular 17.1 or later. ESM only.

## Usage

Each icon is data. Import the `LxIcon` component, and put it on an `<svg>`:

```ts
import { Component } from '@angular/core'
import { HeartDuotone, HeartFilled, LxIcon } from 'lucide-extended-angular'

@Component({
  selector: 'app-example',
  imports: [LxIcon],
  template: `
    <svg [lxIcon]="HeartFilled"></svg>
    <svg [lxIcon]="HeartDuotone" [size]="32" color="crimson" secondaryColor="pink"></svg>
  `,
})
export class Example {
  readonly HeartFilled = HeartFilled
  readonly HeartDuotone = HeartDuotone
}
```

Each icon has its own file too:

```ts
import HeartFilled from 'lucide-extended-angular/heart-filled'
```

Only the icons you import end up in the bundle (tree-shakeable).

## Inputs

`class`, `style`, event bindings and other attributes stay on the `<svg>`. Content inside it, such as a `<title>`, goes after the paths.

| Input | Type | Default | Applies to | Description |
| --- | --- | --- | --- | --- |
| `size` | `number \| string` | `24` | all | Width and height. |
| `color` | `string` | `'currentColor'` | all | Fill on filled icons. Outline on duotone icons. |
| `secondaryColor` | `string` | the value of `color` | duotone | Colour of the backing shape. |
| `secondaryOpacity` | `number \| string` | `0.15` | duotone | Opacity of that shape. |

`strokeWidth` and `absoluteStrokeWidth` are accepted, so Lucide-shaped inputs type-check. Both are ignored. Duotone outlines stay at 2.

`secondaryColor` and `secondaryOpacity` have no effect on filled icons. With one component for every icon, Angular can't reject them by type.

Every icon has the classes `applifted-icon` and `applifted-icon-<name>`, for example `applifted-icon-heart-filled`, followed by your own `class`. Icons are decorative by default, with `aria-hidden="true"`. Set `aria-label` or `aria-labelledby` (as an attribute, or bound with `[aria-label]`) when an icon needs a name, and `aria-hidden` is left off. A binding to `[attr.aria-label]` bypasses this, so use one of the first two.

## Naming

The Lucide name in PascalCase, then `Filled` or `Duotone`: `heart` is `HeartFilled` and `HeartDuotone`, and the deep import is `lucide-extended-angular/heart-filled`.

Lucide's aliases work too, with the same suffixes. When Lucide renames an icon, the old name stays as a deprecated alias, so `AlertCircleFilled` is the same icon as `CircleAlertFilled`.

Not every Lucide icon has both styles yet. [`icons.json`](./icons.json), included in the package, lists every icon with its tags and the styles it has.

## Licence

ISC. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

The shapes are derived from [Lucide](https://github.com/lucide-icons/lucide) (ISC). Some of those are derived from [Feather](https://github.com/feathericons/feather) (MIT). Both notices are in the licence.

## Contributing

Icons are added as SVGs. The steps are in [CONTRIBUTING.md](https://github.com/applifted/lucide-extended/blob/main/CONTRIBUTING.md).

## Support

If the icons are useful to you, you can [buy us a coffee](https://buymeacoffee.com/applifted).
