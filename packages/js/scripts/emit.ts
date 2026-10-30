// Writes src/icons/*.ts and src/index.ts for lucide-extended-js. Each icon is
// plain data; createElement() and createIcons() turn it into an <svg>.
import { writeConstants } from '../../../scripts/constants.ts'
import type { Emitter } from '../../../scripts/generate.ts'
import { toSvgAttrs } from '../../../scripts/lib.ts'
import { iconSource, writeIconModules } from '../../../scripts/modules.ts'

const TYPE = { filled: 'FilledIcon', duotone: 'DuotoneIcon' } as const

export const emit: Emitter = async (icons, { src }) => {
  await writeConstants(src)
  await writeIconModules(
    icons,
    src,
    ({ variant, slug, component, nodes }) => {
      const data = JSON.stringify(nodes.map((n) => [n.tag, toSvgAttrs(n.attrs), n.kind]))
      return iconSource(component, `{ slug: '${slug}', variant: '${variant}', nodes: ${data} }`, {
        imports: `import type { ${TYPE[variant]} } from '../createElement.js'`,
        type: TYPE[variant],
      })
    },
    [
      "export { createElement, createIcons } from './createElement.js'",
      "export type { BaseIconOptions, CreateIconsOptions, DuotoneIcon, DuotoneIconOptions, FilledIcon, Icon, IconNode, IconOptions } from './createElement.js'",
    ],
  )
}
