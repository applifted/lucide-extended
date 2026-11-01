// Writes src/icons/*.ts and src/index.ts for lucide-extended-react.
import { writeConstants } from '../../../scripts/constants.ts'
import type { Emitter } from '../../../scripts/generate.ts'
import { iconSource, writeIconModules } from '../../../scripts/modules.ts'

const FACTORY = { filled: 'createFilledIcon', duotone: 'createDuotoneIcon' } as const

export const emit: Emitter = async (icons, { src }) => {
  await writeConstants(src)
  await writeIconModules(
    icons,
    src,
    ({ variant, slug, component, nodes }) => {
      const data = JSON.stringify(nodes.map((n) => [n.tag, n.attrs, n.kind]))
      return iconSource(component, `${FACTORY[variant]}('${component}', '${slug}', ${data})`, {
        imports: `import { ${FACTORY[variant]} } from '../createIcon.js'`,
      })
    },
    ["export type { IconProps, DuotoneIconProps } from './createIcon.js'"],
  )
}
