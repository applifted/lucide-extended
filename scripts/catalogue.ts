// Builds icons.json from the SVGs in this repo and the Lucide metadata for the
// pinned lucide-react version. Tags, categories, aliases, and use cases come
// from Lucide. This package adds the label and the variants it actually ships.
import { execFile } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import { access, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const ROOT = path.resolve(import.meta.dirname, '..')
const VARIANTS = ['filled', 'duotone'] as const

type Variant = (typeof VARIANTS)[number]

type LucideMeta = {
  tags?: string[]
  categories?: string[]
  aliases?: { name: string }[]
  'use-cases'?: string[]
}

type CatalogueIcon = {
  name: string
  label: string
  tags: string[]
  categories: string[]
  aliases: string[]
  useCases: string[]
  variants: Variant[]
  components: Partial<Record<Variant, string>>
}

function toPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function toLabel(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

async function lucideVersion(): Promise<string> {
  const pkg = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8')) as {
    devDependencies?: Record<string, string>
  }
  const version = pkg.devDependencies?.['lucide-react']
  if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error('package.json devDependencies.lucide-react must be an exact version, such as 1.45.0.')
  }
  return version
}

async function svgNames(variant: Variant): Promise<Set<string>> {
  const dir = path.join(ROOT, 'svg', variant)
  const files = await readdir(dir)
  return new Set(files.filter((file) => file.endsWith('.svg')).map((file) => file.slice(0, -'.svg'.length)))
}

async function findIconsDir(cache: string): Promise<string | undefined> {
  let entries
  try {
    entries = await readdir(cache, { withFileTypes: true })
  } catch {
    return undefined
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const iconsDir = path.join(cache, entry.name, 'icons')
    try {
      await access(path.join(iconsDir, 'heart.json'))
      return iconsDir
    } catch {
      // This directory is not the extracted Lucide tag.
    }
  }
  return undefined
}

async function ensureLucideMeta(version: string): Promise<string> {
  const cache = path.join(ROOT, '.cache', 'lucide-meta', version)
  const cached = await findIconsDir(cache)
  if (cached) return cached

  await mkdir(cache, { recursive: true })
  const archive = path.join(cache, 'source.tar.gz')
  const url = `https://github.com/lucide-icons/lucide/archive/refs/tags/${version}.tar.gz`
  const response = await fetch(url)
  if (!response.ok || !response.body) {
    throw new Error(`Could not download Lucide ${version} metadata (${response.status}).`)
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(archive))

  try {
    const { stdout } = await execFileAsync('tar', ['--version'])
    const gnu = stdout.toLowerCase().includes('gnu')
    // GNU tar and bsdtar express "only these members" differently. Try the
    // platform's usual form first, then the other, and keep the extract only
    // when icons/*.json actually landed on disk.
    const attempts = gnu
      ? [
          ['-xzf', archive, '-C', cache, '--wildcards', '--no-anchored', '*/icons/*.json'],
          ['-xzf', archive, '-C', cache, '--include', '*/icons/*.json'],
        ]
      : [
          ['-xzf', archive, '-C', cache, '--include', '*/icons/*.json'],
          ['-xzf', archive, '-C', cache, '--wildcards', '--no-anchored', '*/icons/*.json'],
        ]
    let iconsDir = await findIconsDir(cache)
    let lastError: unknown
    for (const args of attempts) {
      if (iconsDir) break
      try {
        await execFileAsync('tar', args)
      } catch (error) {
        lastError = error
      }
      iconsDir = await findIconsDir(cache)
    }
    if (!iconsDir) {
      throw lastError instanceof Error
        ? lastError
        : new Error(`Lucide ${version} archive did not contain icons/*.json.`)
    }
    return iconsDir
  } catch (error) {
    await rm(cache, { recursive: true, force: true })
    throw error
  } finally {
    await rm(archive, { force: true })
  }
}

export async function writeCatalogue(): Promise<number> {
  const version = await lucideVersion()
  const iconsDir = await ensureLucideMeta(version)
  const byVariant = {
    filled: await svgNames('filled'),
    duotone: await svgNames('duotone'),
  }
  const names = [...new Set([...byVariant.filled, ...byVariant.duotone])].sort((a, b) => a.localeCompare(b))

  const missing: string[] = []
  const icons: CatalogueIcon[] = []

  for (const name of names) {
    let meta: LucideMeta
    try {
      meta = JSON.parse(await readFile(path.join(iconsDir, `${name}.json`), 'utf8')) as LucideMeta
    } catch {
      missing.push(name)
      continue
    }
    if (!meta.tags?.length) missing.push(name)

    const variants = VARIANTS.filter((variant) => byVariant[variant].has(name))
    const suffix: Record<Variant, string> = { filled: 'Filled', duotone: 'Duotone' }
    const components: CatalogueIcon['components'] = {}
    for (const variant of variants) components[variant] = `${toPascal(name)}${suffix[variant]}`

    icons.push({
      name,
      label: toLabel(name),
      tags: meta.tags ?? [],
      categories: meta.categories ?? [],
      aliases: (meta.aliases ?? []).map((alias) => alias.name).sort((a, b) => a.localeCompare(b)),
      useCases: meta['use-cases'] ?? [],
      variants,
      components,
    })
  }

  if (missing.length) {
    throw new Error(
      `No Lucide ${version} metadata for: ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? '…' : ''}`,
    )
  }

  const catalogue = { lucideVersion: version, icons }
  await writeFile(path.join(ROOT, 'icons.json'), `${JSON.stringify(catalogue, null, 2)}\n`)
  return icons.length
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const count = await writeCatalogue()
  console.log(`Wrote icons.json (${count} icons).`)
}
