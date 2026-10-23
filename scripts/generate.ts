import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { lucideAliases, writeCatalogue } from './catalogue.ts'
import { collectPaths, listSources, readTree, ROOT, toNodes, toPascal, type Variant } from './lib.ts'

const SRC = path.join(ROOT, 'src')
const ICONS = path.join(SRC, 'icons')

const FACTORY: Record<Variant, string> = { filled: 'createFilledIcon', duotone: 'createDuotoneIcon' }

await rm(ICONS, { recursive: true, force: true })
await mkdir(ICONS, { recursive: true })

const exports: { component: string; slug: string }[] = []
const aliases: { component: string; slug: string }[] = []

for (const variant of ['filled', 'duotone'] as const) {
  const suffix = variant === 'filled' ? 'Filled' : 'Duotone'
  for (const { name, file } of await listSources(variant)) {
    const slug = `${name}-${variant}`
    const component = `${toPascal(name)}${suffix}`

    // Tint first so backing shapes sit behind outlines. Sort is stable, so
    // same-kind paths keep Figma's order.
    const nodes = toNodes(collectPaths(await readTree(file))).sort(
      (a, b) => (a.kind === 'tint' ? 0 : 1) - (b.kind === 'tint' ? 0 : 1),
    )
    const data = JSON.stringify(nodes.map((n) => [n.tag, n.attrs, n.kind]))

    const source = `import { ${FACTORY[variant]} } from '../createIcon.js'

const ${component} = ${FACTORY[variant]}('${component}', '${slug}', ${data})

export { ${component} }
export default ${component}
`
    await writeFile(path.join(ICONS, `${slug}.ts`), source)
    exports.push({ component, slug })

    // Lucide keeps old names working as aliases (alert-circle -> circle-alert), so
    // each alias gets its own re-export file, as in lucide-react.
    for (const alias of await lucideAliases(name)) {
      const aliasSlug = `${alias}-${variant}`
      const aliasComponent = `${toPascal(alias)}${suffix}`
      const aliasSource = `import { ${component} } from './${slug}.js'

/** @deprecated Renamed in Lucide. Use \`${component}\`. */
const ${aliasComponent} = ${component}

export { ${aliasComponent} }
export default ${aliasComponent}
`
      await writeFile(path.join(ICONS, `${aliasSlug}.ts`), aliasSource)
      aliases.push({ component: aliasComponent, slug: aliasSlug })
    }
  }
}

const canonical = new Set(exports.map((e) => e.slug))
const clash = aliases.filter((a) => canonical.has(a.slug)).map((a) => a.slug)
if (clash.length) throw new Error(`Lucide aliases clash with icon names: ${clash.join(', ')}`)

const iconCount = exports.length
exports.push(...aliases)
exports.sort((a, b) => a.component.localeCompare(b.component))

const index = [
  ...exports.map(({ component, slug }) => `export { ${component} } from './icons/${slug}.js'`),
  '',
  "export type { IconProps, DuotoneIconProps } from './createIcon.js'",
  '',
].join('\n')

await writeFile(path.join(SRC, 'index.ts'), index)

const filled = exports.filter((e) => e.component.endsWith('Filled')).length - aliases.filter((a) => a.component.endsWith('Filled')).length
console.log(`Generated ${iconCount} icons (${filled} filled, ${iconCount - filled} duotone) and ${aliases.length} aliases.`)

const catalogued = await writeCatalogue()
console.log(`Wrote icons.json (${catalogued} icons).`)
