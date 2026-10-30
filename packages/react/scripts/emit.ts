// Writes src/icons/*.ts and src/index.ts for lucide-extended-react, and copies the
// root README, which is this package's README until each package has its own.
import { copyFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Emitter } from '../../../scripts/generate.ts'

const FACTORY = { filled: 'createFilledIcon', duotone: 'createDuotoneIcon' } as const

export const emit: Emitter = async (icons, { root, dir, src }) => {
  const iconsDir = path.join(src, 'icons')
  const exports: { component: string; slug: string }[] = []

  for (const { variant, slug, component, nodes, aliases } of icons) {
    const data = JSON.stringify(nodes.map((n) => [n.tag, n.attrs, n.kind]))
    const source = `import { ${FACTORY[variant]} } from '../createIcon.js'

const ${component} = ${FACTORY[variant]}('${component}', '${slug}', ${data})

export { ${component} }
export default ${component}
`
    await writeFile(path.join(iconsDir, `${slug}.ts`), source)
    exports.push({ component, slug })

    // Lucide keeps old names working as aliases (alert-circle -> circle-alert), so
    // each alias gets its own re-export file, as in lucide-react.
    for (const alias of aliases) {
      const aliasSource = `import { ${component} } from './${slug}.js'

/** @deprecated Renamed in Lucide. Use \`${component}\`. */
const ${alias.component} = ${component}

export { ${alias.component} }
export default ${alias.component}
`
      await writeFile(path.join(iconsDir, `${alias.slug}.ts`), aliasSource)
      exports.push(alias)
    }
  }

  exports.sort((a, b) => a.component.localeCompare(b.component))
  const index = [
    ...exports.map(({ component, slug }) => `export { ${component} } from './icons/${slug}.js'`),
    '',
    "export type { IconProps, DuotoneIconProps } from './createIcon.js'",
    '',
  ].join('\n')
  await writeFile(path.join(src, 'index.ts'), index)
  await copyFile(path.join(root, 'README.md'), path.join(dir, 'README.md'))
}
