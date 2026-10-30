# lucide-extended-vue

Filled and duotone versions of [Lucide](https://lucide.dev) icons, for Vue.

[Browse the icons](https://lucideextended.applifted.work/) · [Figma](https://www.figma.com/community/file/1687600808552210747) · [npm](https://www.npmjs.com/package/lucide-extended-vue)

> Not affiliated with or endorsed by Lucide.

## Install

```sh
npm install lucide-extended-vue
```

Keep `@lucide/vue` for the outlines. Vue 3.3 or later. ESM only.

## Usage

```vue
<script setup>
import { HeartFilled, HeartDuotone } from 'lucide-extended-vue'
</script>

<template>
  <HeartFilled />
  <HeartDuotone :size="32" color="crimson" secondary-color="pink" />
</template>
```

Each icon has its own file too:

```js
import HeartFilled from 'lucide-extended-vue/heart-filled'
```

Only the icons you import end up in the bundle (tree-shakeable).

## Props

Props work in camelCase or kebab-case (`secondaryColor` or `secondary-color`). Other attributes and listeners (`class`, `style`, `@click`, `aria-label`, and so on) go to the `<svg>`.

| Prop | Type | Default | Applies to | Description |
| --- | --- | --- | --- | --- |
| `size` | `number \| string` | `24` | all | Width and height. |
| `color` | `string` | `'currentColor'` | all | Fill on filled icons. Outline on duotone icons. |
| `secondaryColor` | `string` | the value of `color` | duotone | Colour of the backing shape. |
| `secondaryOpacity` | `number \| string` | `0.15` | duotone | Opacity of that shape. |

`strokeWidth` and `absoluteStrokeWidth` are accepted, so Lucide-shaped props type-check. Both are ignored. Duotone outlines stay at 2.

Filled icons have no `secondaryColor` or `secondaryOpacity`. With Vue 3.4.20 or later, TypeScript and `vue-tsc` reject them; on older versions they're ignored.

Every icon has the classes `applifted-icon` and `applifted-icon-<name>`, for example `applifted-icon-heart-filled`. Icons are decorative by default, with `aria-hidden="true"`. Pass `aria-label` or `aria-labelledby` when an icon needs a name, and `aria-hidden` is left off.

## Naming

The Lucide name in PascalCase, then `Filled` or `Duotone`: `heart` is `HeartFilled` and `HeartDuotone`, and the deep import is `lucide-extended-vue/heart-filled`.

Lucide's aliases work too, with the same suffixes. When Lucide renames an icon, the old name stays as a deprecated alias, so `AlertCircleFilled` is the same component as `CircleAlertFilled`.

Not every Lucide icon has both styles yet. [`icons.json`](./icons.json), included in the package, lists every icon with its tags and the styles it has.

## Licence

ISC. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

The shapes are derived from [Lucide](https://github.com/lucide-icons/lucide) (ISC). Some of those are derived from [Feather](https://github.com/feathericons/feather) (MIT). Both notices are in the licence.

## Contributing

Icons are added as SVGs. The steps are in [CONTRIBUTING.md](https://github.com/applifted/lucide-extended/blob/main/CONTRIBUTING.md).

## Support

If the icons are useful to you, you can [buy us a coffee](https://buymeacoffee.com/applifted).
