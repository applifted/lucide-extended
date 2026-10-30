# lucide-extended-static

Filled and duotone versions of [Lucide](https://lucide.dev) icons, as SVG files, an SVG sprite and SVG strings.

[Browse the icons](https://lucideextended.applifted.work/) · [Figma](https://www.figma.com/community/file/1687600808552210747) · [npm](https://www.npmjs.com/package/lucide-extended-static)

> Not affiliated with or endorsed by Lucide.

## Install

```sh
npm install lucide-extended-static
```

ESM only.

## SVG files

Every icon is a file in `icons/`, named `<name>-filled.svg` or `<name>-duotone.svg`:

```js
import heartUrl from 'lucide-extended-static/icons/heart-filled.svg'
```

How an `.svg` import resolves depends on your bundler. The files are also at `node_modules/lucide-extended-static/icons/`.

## Sprite

`sprite.svg` holds every icon as a `<symbol>`, with the file name as its `id`:

```html
<svg width="24" height="24" class="applifted-icon">
  <use href="/sprite.svg#heart-filled" />
</svg>
```

Serve the file from your own site. Aliases aren't in the sprite; use the current Lucide name.

## SVG strings

Every icon is also exported as a string of SVG markup:

```js
import { HeartFilled } from 'lucide-extended-static'
import HeartDuotone from 'lucide-extended-static/heart-duotone'

element.innerHTML = HeartFilled
```

Only the icons you import end up in the bundle (tree-shakeable).

## Colours and size

The SVGs use `currentColor`, so they take the CSS `color` of their surroundings. That needs the SVG inline, as a string or through the sprite. An SVG loaded with `<img>` can't inherit a colour and renders black.

Duotone icons draw their backing shape in the same colour at opacity `0.15`. It is fixed in the markup; for a different secondary colour or opacity, use `lucide-extended-js` or a framework package. Icons are 24 × 24, and `width` and `height` can be changed like any SVG's.

Every SVG has the classes `applifted-icon` and `applifted-icon-<name>`, for example `applifted-icon-heart-filled`, and `aria-hidden="true"`. Remove it and add an `aria-label` when an icon needs a name.

## Naming

The Lucide name, then `-filled` or `-duotone` for files and sprite ids (`heart-filled`), and the PascalCase name with `Filled` or `Duotone` for exports (`HeartFilled`).

Lucide's aliases work too. When Lucide renames an icon, the old name stays as a deprecated alias: `AlertCircleFilled` and `icons/alert-circle-filled.svg` are the same as `CircleAlertFilled`.

Not every Lucide icon has both styles yet. [`icons.json`](./icons.json), included in the package, lists every icon with its tags and the styles it has.

## Licence

ISC. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

The shapes are derived from [Lucide](https://github.com/lucide-icons/lucide) (ISC). Some of those are derived from [Feather](https://github.com/feathericons/feather) (MIT). Both notices are in the licence.

## Contributing

Icons are added as SVGs. The steps are in [CONTRIBUTING.md](https://github.com/applifted/lucide-extended/blob/main/CONTRIBUTING.md).

## Support

If the icons are useful to you, you can [buy us a coffee](https://buymeacoffee.com/applifted).
