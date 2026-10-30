# lucide-extended-react-native

Filled and duotone versions of [Lucide](https://lucide.dev) icons, for React Native.

[Browse the icons](https://lucideextended.applifted.work/) · [Figma](https://www.figma.com/community/file/1687600808552210747) · [npm](https://www.npmjs.com/package/lucide-extended-react-native)

> Not affiliated with or endorsed by Lucide.

## Install

```sh
npm install lucide-extended-react-native react-native-svg
```

Keep `lucide-react-native` for the outlines. React Native with `react-native-svg` 13 or later. ESM only.

## Usage

```tsx
import HeartFilled from 'lucide-extended-react-native/heart-filled'
import HeartDuotone from 'lucide-extended-react-native/heart-duotone'

export function Example() {
  return (
    <>
      <HeartFilled color="black" />
      <HeartDuotone size={32} color="crimson" secondaryColor="pink" />
    </>
  )
}
```

**Import each icon from its own file**, as above. Metro doesn't tree-shake by default, so `import { HeartFilled } from 'lucide-extended-react-native'` bundles every icon, about 2.5 MB. Each deep import adds only that icon.

Deep imports need Metro's support for package `exports`, which is on by default from React Native 0.79 (Expo SDK 53). On older versions, turn it on in `metro.config.js`:

```js
config.resolver.unstable_enablePackageExports = true
```

## Props

Icons take the usual `react-native-svg` `Svg` props (`style`, `testID`, `onPress`, and so on), plus:

| Prop | Type | Default | Applies to | Description |
| --- | --- | --- | --- | --- |
| `size` | `number \| string` | `24` | all | Width and height. |
| `color` | `string` | `'black'` | all | Fill on filled icons. Outline on duotone icons. |
| `secondaryColor` | `string` | the value of `color` | duotone | Colour of the backing shape. |
| `secondaryOpacity` | `number \| string` | `0.15` | duotone | Opacity of that shape. |

`strokeWidth` and `absoluteStrokeWidth` are accepted, so Lucide-shaped props type-check. Both are ignored. Duotone outlines stay at 2.

There's no inherited text colour in React Native, so pass `color` to match your theme.

Filled icons have no `secondaryColor` or `secondaryOpacity`; TypeScript rejects them.

`ref` goes to the `Svg`. Icons are hidden from screen readers by default (`accessibilityElementsHidden` on iOS, `importantForAccessibility="no-hide-descendants"` on Android). Pass `accessibilityLabel` or `aria-label` when an icon needs a name: it then becomes an accessible image.

## Naming

The Lucide name in PascalCase, then `Filled` or `Duotone`: `heart` is `HeartFilled` and `HeartDuotone`, and the deep import is `lucide-extended-react-native/heart-filled`.

Lucide's aliases work too, with the same suffixes. When Lucide renames an icon, the old name stays as a deprecated alias, so `AlertCircleFilled` is the same component as `CircleAlertFilled`.

Not every Lucide icon has both styles yet. [`icons.json`](./icons.json), included in the package, lists every icon with its tags and the styles it has.

## Licence

ISC. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

The shapes are derived from [Lucide](https://github.com/lucide-icons/lucide) (ISC). Some of those are derived from [Feather](https://github.com/feathericons/feather) (MIT). Both notices are in the licence.

## Contributing

Icons are added as SVGs. The steps are in [CONTRIBUTING.md](https://github.com/applifted/lucide-extended/blob/main/CONTRIBUTING.md).

## Support

If the icons are useful to you, you can [buy us a coffee](https://buymeacoffee.com/applifted).
