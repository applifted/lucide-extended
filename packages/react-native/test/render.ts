import type { ReactElement } from 'react'
import { Path, Svg } from './react-native-svg.js'

type Element = ReactElement<Record<string, unknown> & { children?: unknown[] }>

/** Calls an icon's render function and returns the <Svg> element and its <Path> children. */
export function render(icon: unknown, props: Record<string, unknown> = {}, ref: unknown = null) {
  const svg = (icon as { render: (props: unknown, ref: unknown) => Element }).render(props, ref)
  if (svg.type !== Svg) throw new Error('expected an <Svg>')
  const children = (svg.props.children ?? []).filter((c) => c != null) as Element[]
  return { svg, paths: children.filter((c) => c.type === Path), children }
}

const SVG_NAMES: Record<string, string> = {
  fillRule: 'fill-rule',
  clipRule: 'clip-rule',
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
}

const attrs = (props: Record<string, unknown>, keep: string[]) =>
  Object.entries(props)
    .filter(([key]) => keep.includes(key))
    .map(([key, value]) => ` ${SVG_NAMES[key] ?? key}="${value}"`)
    .join('')

/** The SVG markup react-native-svg would draw, for comparison with lucide-extended-static. */
export function toMarkup(icon: unknown, props: Record<string, unknown> = {}): string {
  const { svg, paths } = render(icon, props)
  const svgAttrs = attrs(svg.props, ['width', 'height', 'viewBox', 'fill'])
  const pathAttrs = ['d', 'fillRule', 'clipRule', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'opacity']
  return `<svg${svgAttrs}>${paths.map((p) => `<path${attrs(p.props, pathAttrs)}></path>`).join('')}</svg>`
}
