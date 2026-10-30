// The module layout every package shares: src/icons/<slug>.ts for each icon, a
// deprecated re-export for each Lucide alias, and src/index.ts re-exporting them all.
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { IconName, SourceIcon } from './icons.ts'

/** An icon module: `const <component> = <value>`, as both the named and default export. */
export function iconSource(component: string, value: string, { imports, type }: { imports?: string; type?: string } = {}) {
  const declaration = `const ${component}${type ? `: ${type}` : ''} = ${value}`
  return `${imports ? `${imports}\n\n` : ''}${declaration}\n\nexport { ${component} }\nexport default ${component}\n`
}

// Lucide keeps old names working as aliases (alert-circle -> circle-alert), so
// each alias gets its own re-export file, as in lucide-react.
function aliasSource(alias: IconName, { component, slug }: IconName) {
  return `import { ${component} } from './${slug}.js'

/** @deprecated Renamed in Lucide. Use \`${component}\`. */
const ${alias.component} = ${component}

export { ${alias.component} }
export default ${alias.component}
`
}

/**
 * Writes src/icons/<slug>.ts for every icon (from `source`) and alias, then
 * src/index.ts re-exporting each one, followed by `indexExtra` lines.
 */
export async function writeIconModules(
  icons: SourceIcon[],
  src: string,
  source: (icon: SourceIcon) => string,
  indexExtra: string[] = [],
): Promise<void> {
  const exports: IconName[] = []
  for (const icon of icons) {
    await writeFile(path.join(src, 'icons', `${icon.slug}.ts`), source(icon))
    exports.push(icon)
    for (const alias of icon.aliases) {
      await writeFile(path.join(src, 'icons', `${alias.slug}.ts`), aliasSource(alias, icon))
      exports.push(alias)
    }
  }

  exports.sort((a, b) => a.component.localeCompare(b.component))
  const index = [
    ...exports.map(({ component, slug }) => `export { ${component} } from './icons/${slug}.js'`),
    ...(indexExtra.length ? ['', ...indexExtra] : []),
    '',
  ]
  await writeFile(path.join(src, 'index.ts'), index.join('\n'))
}
