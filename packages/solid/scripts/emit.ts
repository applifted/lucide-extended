// Writes src/icons/*.ts and src/index.ts for lucide-extended-solid.
import { writeConstants } from '../../../scripts/constants.ts'
import type { Emitter } from '../../../scripts/generate.ts'
import { toSvgAttrs } from '../../../scripts/lib.ts'
import { iconSource, writeIconModules } from '../../../scripts/modules.ts'

const FACTORY = { filled: 'createFilledIcon', duotone: 'createDuotoneIcon' } as const

export const emit: Emitter = async (icons, { src }) => {
  await writeConstants(src)
  await writeIconModules(
    icons,
    src,
    ({ variant, slug, component, nodes }) => {
      const data = JSON.stringify(nodes.map((n) => [n.tag, toSvgAttrs(n.attrs), n.kind]))
      return iconSource(component, `${FACTORY[variant]}('${slug}', ${data})`, {
        imports: `import { ${FACTORY[variant]} } from '../createIcon.js'`,
      })
    },
    ["export type { DuotoneIcon, DuotoneIconProps, Icon, IconProps } from './createIcon.js'"],
  )
}
