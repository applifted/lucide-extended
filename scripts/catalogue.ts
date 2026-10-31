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
  deprecated?: boolean
  deprecationReason?: string
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
  /** Lucide's reason, only on icons Lucide has deprecated */
  deprecated?: string
}

// Lucide's own wording for each icon deprecation reason, as lucide-react uses
// in its @deprecated JSDoc.
const DEPRECATION: Record<string, string> = {
  'icon.design': "Removed because the icon didn't meet our design guidelines.",
  'icon.use-case': 'Removed because the depicted concept became obsolete and no longer had relevant use cases.',
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

// What one icon takes from the pinned release's metadata: its alias names, which
// Lucide exports as second names for the same icon, and why Lucide deprecated
// it, if it did.
export async function lucideIcon(name: string): Promise<{ aliases: string[]; deprecated?: string }> {
  const meta = (await lucideMetadata(await lucideVersion())).get(name)
  return {
    aliases: (meta?.aliases ?? []).map((alias) => alias.name).sort((a, b) => a.localeCompare(b)),
    deprecated: meta && deprecation(name, meta),
  }
}

function deprecation(name: string, meta: LucideMeta): string | undefined {
  if (!meta.deprecated) return undefined
  const reason = DEPRECATION[meta.deprecationReason ?? '']
  if (!reason) throw new Error(`Unknown Lucide deprecation reason for ${name}: ${meta.deprecationReason}`)
  return reason
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
    // when icons/*.json actually landed on disk. groups/*.json holds the tag
    // groups that icons reference with `$group:` (Lucide 1.65.0 and later).
    const members = ['*/icons/*.json', '*/groups/*.json']
    const gnuArgs = ['-xzf', archive, '-C', cache, '--wildcards', '--no-anchored', ...members]
    const bsdArgs = ['-xzf', archive, '-C', cache, ...members.flatMap((member) => ['--include', member])]
    const attempts = gnu ? [gnuArgs, bsdArgs] : [bsdArgs, gnuArgs]
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

// Every icon's metadata in the pinned release, read once, with markers resolved.
const metadataCache = new Map<string, Promise<Map<string, LucideMeta>>>()

function lucideMetadata(version: string): Promise<Map<string, LucideMeta>> {
  let metadata = metadataCache.get(version)
  if (!metadata) {
    metadata = readMetadata(version)
    metadataCache.set(version, metadata)
  }
  return metadata
}

async function readJsonDir<T>(dir: string): Promise<Map<string, T>> {
  let files: string[]
  try {
    files = (await readdir(dir)).filter((file) => file.endsWith('.json'))
  } catch {
    return new Map()
  }
  const entries = await Promise.all(
    files.map(async (file) => [file.slice(0, -'.json'.length), JSON.parse(await readFile(path.join(dir, file), 'utf8')) as T] as const),
  )
  return new Map(entries)
}

async function readMetadata(version: string): Promise<Map<string, LucideMeta>> {
  const iconsDir = await ensureLucideMeta(version)
  const raw = await readJsonDir<LucideMeta>(iconsDir)
  const groups = await readJsonDir<{ tags: string[] }>(path.join(iconsDir, '..', 'groups'))
  const resolved = new Map<string, LucideMeta>()

  // Lucide's metadata reuses values with markers that its build expands: in
  // tags and categories, `$extends:<icon>` becomes that icon's resolved values,
  // and in tags, `$group:<group>` becomes groups/<group>.json's tags. Both
  // expand in place, and the first of any duplicates wins, as in Lucide's
  // resolveMetadataExtends. Lucide doesn't expand use cases, but signpost-big
  // has `$extends:signpost` there (1.66.0), so `$extends:` is expanded in use
  // cases too rather than shipping the marker as a use case.
  const resolve = (name: string, stack: string[] = []): LucideMeta => {
    const done = resolved.get(name)
    if (done) return done
    const meta = raw.get(name)
    if (!meta) throw new Error(`Lucide ${version}: ${stack.at(-1)} extends unknown icon ${name}.`)
    if (stack.includes(name)) throw new Error(`Lucide ${version}: circular $extends: ${[...stack, name].join(' -> ')}`)

    const expand = (field: 'tags' | 'categories' | 'use-cases'): string[] => {
      const values = (meta[field] ?? []).flatMap((value) => {
        if (value.startsWith('$extends:')) return resolve(value.slice('$extends:'.length), [...stack, name])[field] ?? []
        if (value.startsWith('$group:') && field === 'tags') {
          const group = groups.get(value.slice('$group:'.length))
          if (!group) {
            throw new Error(
              `Lucide ${version}: ${name} uses ${value}, which isn't in groups/. Delete .cache/lucide-meta/${version} and run again.`,
            )
          }
          return group.tags
        }
        if (/^\$[a-z-]+:/.test(value)) throw new Error(`Lucide ${version}: unknown marker ${value} in ${name}.${field}.`)
        return [value]
      })
      return [...new Set(values)]
    }

    const result = { ...meta, tags: expand('tags'), categories: expand('categories'), 'use-cases': expand('use-cases') }
    resolved.set(name, result)
    return result
  }

  for (const name of raw.keys()) resolve(name)
  return resolved
}

export async function writeCatalogue(): Promise<number> {
  const version = await lucideVersion()
  const metadata = await lucideMetadata(version)
  const byVariant = {
    filled: await svgNames('filled'),
    duotone: await svgNames('duotone'),
  }
  const names = [...new Set([...byVariant.filled, ...byVariant.duotone])].sort((a, b) => a.localeCompare(b))

  const missing: string[] = []
  const icons: CatalogueIcon[] = []

  for (const name of names) {
    const meta = metadata.get(name)
    if (!meta) {
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
      ...(meta.deprecated && { deprecated: deprecation(name, meta) }),
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
