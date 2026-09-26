# lucide-extended-react

Filled and duotone React icons that use Lucide's icon names, designed to sit alongside `lucide-react`.

> Not affiliated with or endorsed by Lucide.

## Install

```sh
npm install lucide-extended-react
```

Requires React 18 or later. The package is ESM only.

## Usage

Import icons by name from the package root:

```tsx
import { HeartFilled, HeartDuotone } from 'lucide-extended-react'

export function Example() {
  return (
    <>
      <HeartFilled />
      <HeartDuotone size={32} color="crimson" />
    </>
  )
}
```

Each icon is also available as a deep import from its own file:

```tsx
import HeartFilled from 'lucide-extended-react/heart-filled'
import HeartDuotone from 'lucide-extended-react/heart-duotone'
```

Both styles are tree-shakeable: your bundle only includes the icons you import.

### Using with `lucide-react`

The icons share Lucide's names, so you can use Lucide's outline icons and these variants side by side:

```tsx
import { Heart } from 'lucide-react'
import { HeartFilled, HeartDuotone } from 'lucide-extended-react'

export function LikeButton({ liked }: { liked: boolean }) {
  return liked ? <HeartFilled color="crimson" /> : <Heart />
}
```

This is a separate package, not a drop-in replacement. Not every Lucide icon has a filled or duotone version, and the props are similar to Lucide's but not identical: see below.

## Props

All icons accept the standard SVG attributes (`className`, `style`, `onClick`, `aria-label` and so on), plus:

| Prop | Type | Default | Applies to | Description |
| --- | --- | --- | --- | --- |
| `size` | `number \| string` | `24` | all | Sets both `width` and `height`. |
| `color` | `string` | `'currentColor'` | all | Main colour: the fill of filled icons and the outline of duotone icons. |
| `secondaryColor` | `string` | the value of `color` | duotone | Colour of the translucent backing shape. |
| `secondaryOpacity` | `number \| string` | `0.15` | duotone | Opacity of the translucent backing shape. |
| `strokeWidth` | `number \| string` | — | all | Accepted so Lucide-style props type-check, but ignored. Duotone outlines are always 2. |
| `absoluteStrokeWidth` | `boolean` | — | all | Accepted and ignored, as above. |

Filled icons do not accept `secondaryColor` or `secondaryOpacity`.

Every icon forwards its `ref` to the `<svg>` element and has the classes `applifted-icon` and `applifted-icon-<name>`, for example `applifted-icon-heart-filled`.

### Accessibility

Icons are decorative by default and render with `aria-hidden="true"`. Pass `aria-label` or `aria-labelledby` to give an icon an accessible name; `aria-hidden` is then left off.

```tsx
<HeartFilled aria-label="Liked" />
```

## Naming

Component name = the icon's Lucide name in PascalCase + `Filled` or `Duotone`.

| Lucide name | Filled | Duotone | Deep import |
| --- | --- | --- | --- |
| `heart` | `HeartFilled` | `HeartDuotone` | `lucide-extended-react/heart-filled` |
| `circle-check` | `CircleCheckFilled` | `CircleCheckDuotone` | `lucide-extended-react/circle-check-duotone` |

## Icons

- 1,387 filled icons
- 1,242 duotone icons

Some icons exist in only one of the two styles.

## Licence

ISC. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

The icon shapes are derived from [Lucide](https://github.com/lucide-icons/lucide) (ISC), some of which are in turn derived from [Feather](https://github.com/feathericons/feather) (MIT). Both notices are kept in the LICENSE file.

Not affiliated with or endorsed by Lucide.
