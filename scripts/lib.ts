import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { optimize, type Config } from 'svgo'
import { parse, type INode } from 'svgson'

export type Kind = 'stroke' | 'tint' | 'fill'
export type Variant = 'filled' | 'duotone'
export type IconNode = { tag: string; attrs: Record<string, string>; kind: Kind }

export const ROOT = path.resolve(import.meta.dirname, '..')
export const VARIANTS: Variant[] = ['filled', 'duotone']

export const svgoConfig: Config = {
  multipass: true,
  plugins: [
    // Figma adds a redundant style="fill:…;fill-opacity:1;" to every path — strip it first
    { name: 'removeAttrs', params: { attrs: 'style' } },
    // SVGO 4 dropped removeViewBox from preset-default, so viewBox is kept without an override
    'preset-default',
    'removeDimensions',
  ],
}

// Single source of truth for path kinds. Stroke wins over opacity.
export function classify(attrs: Record<string, string>): Kind {
  if (attrs.stroke && attrs.stroke !== 'none') return 'stroke'
  if (attrs.opacity !== undefined && Number(attrs.opacity) < 1) return 'tint'
  return 'fill'
}

export async function readTree(file: string): Promise<INode> {
  const raw = await readFile(file, 'utf8')
  const { data } = optimize(raw, { ...svgoConfig, path: file })
  return parse(data)
}

export function collectPaths(tree: INode): INode[] {
  const out: INode[] = []
  const walk = (node: INode) => {
    if (node.name === 'path') out.push(node)
    node.children.forEach(walk)
  }
  walk(tree)
  return out
}

const KEEP: Record<string, string> = { d: 'd', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule' }

export function toNodes(paths: INode[]): IconNode[] {
  return paths.map((p) => {
    const attrs: Record<string, string> = {}
    for (const [key, value] of Object.entries(p.attributes)) {
      if (KEEP[key]) attrs[KEEP[key]] = value
    }
    return { tag: p.name, attrs, kind: classify(p.attributes) }
  })
}

export function toPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

// Sorted source files for one variant: [{ name, file }]
export async function listSources(variant: Variant): Promise<{ name: string; file: string }[]> {
  const files = await fg(`svg/${variant}/*.svg`, { cwd: ROOT, absolute: true })
  return files
    .map((file) => ({ name: path.basename(file, '.svg'), file }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
