// Writes src/icons/*.ts and src/index.ts for lucide-extended-react-native.
import { writeConstants } from '../../../scripts/constants.ts'
import type { Emitter } from '../../../scripts/generate.ts'
import { iconSource, writeIconModules } from '../../../scripts/modules.ts'

const FACTORY = { filled: 'createFilledIcon', duotone: 'createDuotoneIcon' } as const

export const emit: Emitter = async (icons, { src }) => {
  await writeConstants(src)
  await writeIconModules(
    icons,
    src,
    ({ variant, component, nodes }) => {
      // react-native-svg takes React's camelCase names (fillRule)
      const data = JSON.stringify(nodes.map((n) => [n.tag, n.attrs, n.kind]))
      return iconSource(component, `${FACTORY[variant]}('${component}', ${data})`, {
        imports: `import { ${FACTORY[variant]} } from '../createIcon.js'`,
      })
    },
    ["export type { DuotoneIcon, DuotoneIconProps, Icon, IconProps } from './createIcon.js'"],
  )
}
