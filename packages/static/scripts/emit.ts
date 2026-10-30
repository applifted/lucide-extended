// Writes lucide-extended-static: one SVG file per icon in icons/, every icon as a
// <symbol> in sprite.svg, and each SVG as a string export in src/icons/*.ts.
// Static SVGs can't take props, so colours are currentColor and the tint opacity
// is baked in.
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Emitter } from '../../../scripts/generate.ts'
import { TINT_OPACITY } from '../../../scripts/constants.ts'
import { toSvgAttrs, type IconNode, type Kind } from '../../../scripts/lib.ts'
import type { SourceIcon } from '../../../scripts/icons.ts'
import { iconSource, writeIconModules } from '../../../scripts/modules.ts'

const PAINT: Record<Kind, Record<string, string>> = {
  stroke: { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  tint: { fill: 'currentColor', opacity: String(TINT_OPACITY) },
  fill: { fill: 'currentColor' },
}

const attributes = (attrs: Record<string, string>) =>
  Object.entries(attrs)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('')

const paths = (nodes: IconNode[], indent: string) =>
  nodes.map((n) => `${indent}<${n.tag}${attributes({ ...toSvgAttrs(n.attrs), ...PAINT[n.kind] })} />`).join('\n')

function toSvg({ slug, nodes }: SourceIcon): string {
  const root = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    class: `applifted-icon applifted-icon-${slug}`,
    'aria-hidden': 'true',
  }
  return `<svg${attributes(root)}>\n${paths(nodes, '  ')}\n</svg>\n`
}

function toSprite(icons: SourceIcon[]): string {
  const symbols = icons.map(
    (icon) => `  <symbol id="${icon.slug}" viewBox="0 0 24 24" fill="none">\n${paths(icon.nodes, '    ')}\n  </symbol>`,
  )
  return `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join('\n')}\n</svg>\n`
}

export const emit: Emitter = async (icons, { dir, src }) => {
  const svgDir = path.join(dir, 'icons')
  await rm(svgDir, { recursive: true, force: true })
  await mkdir(svgDir)

  // An alias is the same icon under Lucide's old name, so its file has the same content
  for (const icon of icons) {
    const svg = toSvg(icon)
    for (const { slug } of [icon, ...icon.aliases]) await writeFile(path.join(svgDir, `${slug}.svg`), svg)
  }

  // Aliases are left out of the sprite so it holds each icon once
  await writeFile(path.join(dir, 'sprite.svg'), toSprite(icons))

  await writeIconModules(icons, src, (icon) => iconSource(icon.component, JSON.stringify(toSvg(icon))))
}
