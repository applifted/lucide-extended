// The shared icon model every package's emitter consumes: path kinds, order,
// kept attributes, and which exports exist.
import { describe, expect, it } from 'vitest'
import { loadIcons, toIcon } from '../scripts/icons.ts'
import { classify, parseSvg } from '../scripts/lib.ts'

const svg = (paths: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${paths}</svg>`
const stroke = (d: string) => `<path d="${d}" fill="none" stroke="black" stroke-width="2"/>`
const tint = (d: string) => `<path d="${d}" fill="black" opacity="0.15"/>`

describe('classify', () => {
  it('treats a stroked path as stroke even with opacity below 1', () => {
    expect(classify({ stroke: 'black', opacity: '0.15' })).toBe('stroke')
  })

  it('treats opacity below 1 as tint and anything else as fill', () => {
    expect(classify({ fill: 'black', opacity: '0.15' })).toBe('tint')
    expect(classify({ fill: 'black' })).toBe('fill')
    expect(classify({ stroke: 'none', fill: 'black' })).toBe('fill')
  })
})

describe('toIcon', () => {
  it('sorts tint paths before stroke paths and keeps same-kind order', async () => {
    const tree = await parseSvg(svg(stroke('M1 1h4') + tint('M2 2h4') + stroke('M3 3h4') + tint('M4 4h4')))
    const { nodes } = toIcon('example', 'duotone', tree)
    expect(nodes.map((n) => [n.kind, n.attrs.d])).toEqual([
      ['tint', 'M2 2h4'],
      ['tint', 'M4 4h4'],
      ['stroke', 'M1 1h4'],
      ['stroke', 'M3 3h4'],
    ])
  })

  it('keeps fillRule and clipRule and drops paint attributes', async () => {
    const tree = await parseSvg(svg('<path d="M0 0h24v24H0zM6 6h12v12H6z" fill="black" fill-rule="evenodd" clip-rule="evenodd"/>'))
    const [node] = toIcon('example', 'filled', tree).nodes
    expect(node.attrs).toEqual({ d: expect.any(String), fillRule: 'evenodd', clipRule: 'evenodd' })
  })

  it('names the icon and its aliases with the variant suffix', async () => {
    const icon = toIcon('circle-alert', 'filled', await parseSvg(svg('<path d="M0 0h1"/>')), ['alert-circle'])
    expect(icon).toMatchObject({ slug: 'circle-alert-filled', component: 'CircleAlertFilled' })
    expect(icon.aliases).toEqual([{ slug: 'alert-circle-filled', component: 'AlertCircleFilled' }])
  })

  it('carries a deprecation reason only when given one', async () => {
    const tree = await parseSvg(svg('<path d="M0 0h1"/>'))
    expect(toIcon('badge-euro', 'filled', tree, [], 'Removed.').deprecated).toBe('Removed.')
    expect(toIcon('heart', 'filled', tree)).not.toHaveProperty('deprecated')
  })
})

describe('loadIcons', async () => {
  const icons = await loadIcons()
  const slugs = new Set(icons.map((i) => i.slug))

  it('exports only the variants that have a source SVG', () => {
    // clover is drawn as duotone only
    expect(slugs.has('clover-duotone')).toBe(true)
    expect(slugs.has('clover-filled')).toBe(false)
  })

  it('gives every name one slug and one component', () => {
    const all = icons.flatMap((i) => [i, ...i.aliases])
    expect(new Set(all.map((i) => i.slug)).size).toBe(all.length)
    expect(new Set(all.map((i) => i.component)).size).toBe(all.length)
  })

  it('marks the icons Lucide has deprecated', () => {
    expect(icons.find((i) => i.slug === 'badge-euro-duotone')?.deprecated).toMatch(/^Removed because/)
    expect(icons.find((i) => i.slug === 'heart-filled')).not.toHaveProperty('deprecated')
  })

  it('puts every tint before every stroke', () => {
    for (const { slug, nodes } of icons) {
      const kinds = nodes.map((n) => n.kind)
      if (!kinds.includes('tint') || !kinds.includes('stroke')) continue
      expect(kinds.lastIndexOf('tint'), slug).toBeLessThan(kinds.indexOf('stroke'))
    }
  })
}, 120_000)
