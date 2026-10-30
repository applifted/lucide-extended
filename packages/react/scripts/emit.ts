// Writes src/icons/*.ts and src/index.ts for lucide-extended-react, and copies the
// root README, which is this package's README.
import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import { writeConstants } from '../../../scripts/constants.ts'
import type { Emitter } from '../../../scripts/generate.ts'
import { iconSource, writeIconModules } from '../../../scripts/modules.ts'

const FACTORY = { filled: 'createFilledIcon', duotone: 'createDuotoneIcon' } as const

export const emit: Emitter = async (icons, { root, dir, src }) => {
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
  await copyFile(path.join(root, 'README.md'), path.join(dir, 'README.md'))
}
