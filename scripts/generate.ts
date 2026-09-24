import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { collectPaths, listSources, readTree, ROOT, toNodes, toPascal, type Variant } from './lib.ts'

const SRC = path.join(ROOT, 'src')
const ICONS = path.join(SRC, 'icons')

const FACTORY: Record<Variant, string> = { filled: 'createFilledIcon', duotone: 'createDuotoneIcon' }

await rm(ICONS, { recursive: true, force: true })
await mkdir(ICONS, { recursive: true })

const exports: { component: string; slug: string }[] = []

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
  }
}

exports.sort((a, b) => a.component.localeCompare(b.component))

const index = [
  ...exports.map(({ component, slug }) => `export { ${component} } from './icons/${slug}.js'`),
  '',
  "export type { IconProps, DuotoneIconProps } from './createIcon.js'",
  '',
].join('\n')

await writeFile(path.join(SRC, 'index.ts'), index)

const filled = exports.filter((e) => e.component.endsWith('Filled')).length
console.log(`Generated ${exports.length} icons (${filled} filled, ${exports.length - filled} duotone).`)
