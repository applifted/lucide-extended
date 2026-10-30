// Generates every package under packages/ from the source SVGs, then icons.json.
// Each package owns scripts/emit.ts; parsing and path classification happen
// once here, so every package renders the same nodes in the same order.
//
//   npm run generate              every package
//   npm run generate -- react js  only those packages (directory names)
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { writeCatalogue } from './catalogue.ts'
import { loadIcons, type SourceIcon } from './icons.ts'
import { ROOT } from './lib.ts'

export type Emitter = (icons: SourceIcon[], ctx: { root: string; dir: string; src: string }) => Promise<void>

// Copied into each package so npm includes them in its tarball
const SHARED_FILES = ['LICENSE', 'NOTICE']

// Generated files in each package's src/ — all git-ignored
const GENERATED = ['icons', 'index.ts', 'constants.ts']

/** Package directory names under packages/, optionally narrowed to `targets`. */
export async function listPackages(targets: string[] = []): Promise<string[]> {
  const entries = await readdir(path.join(ROOT, 'packages'), { withFileTypes: true })
  const all = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()
  const unknown = targets.filter((t) => !all.includes(t))
  if (unknown.length) throw new Error(`Unknown package(s): ${unknown.join(', ')}. Expected one of: ${all.join(', ')}`)
  return targets.length ? all.filter((name) => targets.includes(name)) : all
}

export async function generate(targets: string[] = []): Promise<void> {
  const packages = await listPackages(targets)
  const icons = await loadIcons()
  const filled = icons.filter((i) => i.variant === 'filled').length
  const aliases = icons.reduce((n, i) => n + i.aliases.length, 0)
  console.log(`Loaded ${icons.length} icons (${filled} filled, ${icons.length - filled} duotone) and ${aliases} aliases.`)

  // icons.json first, so packages copy the current catalogue
  const catalogued = await writeCatalogue()
  console.log(`Wrote icons.json (${catalogued} icons).`)

  for (const name of packages) {
    const dir = path.join(ROOT, 'packages', name)
    const src = path.join(dir, 'src')
    const { emit } = (await import(pathToFileURL(path.join(dir, 'scripts', 'emit.ts')).href)) as { emit: Emitter }

    for (const file of GENERATED) await rm(path.join(src, file), { recursive: true, force: true })
    await mkdir(path.join(src, 'icons'), { recursive: true })
    await emit(icons, { root: ROOT, dir, src })

    for (const file of [...SHARED_FILES, 'icons.json']) await copyFile(path.join(ROOT, file), path.join(dir, file))
    console.log(`Generated packages/${name}.`)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  await generate(process.argv.slice(2))
}
