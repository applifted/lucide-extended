// Writes src/icons/*.ts and src/index.ts for lucide-extended-js. Each icon is
// plain data; createElement() and createIcons() turn it into an <svg>.
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { writeConstants } from '../../../scripts/constants.ts'
import type { Emitter } from '../../../scripts/generate.ts'
import { toSvgAttrs } from '../../../scripts/lib.ts'

const TYPE = { filled: 'FilledIcon', duotone: 'DuotoneIcon' } as const

export const emit: Emitter = async (icons, { src }) => {
  await writeConstants(src)
  const iconsDir = path.join(src, 'icons')
  const exports: { component: string; slug: string }[] = []

  for (const { variant, slug, component, nodes, aliases } of icons) {
    const data = JSON.stringify(nodes.map((n) => [n.tag, toSvgAttrs(n.attrs), n.kind]))
    const source = `import type { ${TYPE[variant]} } from '../createElement.js'

const ${component}: ${TYPE[variant]} = { slug: '${slug}', variant: '${variant}', nodes: ${data} }

export { ${component} }
export default ${component}
`
    await writeFile(path.join(iconsDir, `${slug}.ts`), source)
    exports.push({ component, slug })

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
    "export { createElement, createIcons } from './createElement.js'",
    "export type { BaseIconOptions, CreateIconsOptions, DuotoneIcon, DuotoneIconOptions, FilledIcon, Icon, IconNode, IconOptions } from './createElement.js'",
    '',
  ].join('\n')
  await writeFile(path.join(src, 'index.ts'), index)
}
