import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { parseSync, type INode } from 'svgson'
import { beforeAll, describe, expect, it } from 'vitest'
import * as stat from '../../static/src/index.ts'
import * as icons from '../src/index.js'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

let container: AstroContainer
beforeAll(async () => {
  container = await AstroContainer.create()
})

const render = async (component: unknown, props: Record<string, unknown> = {}, slots?: Record<string, string>) =>
  parseSync(await container.renderToString(component as never, { props, slots }))
const pathsOf = (svg: INode) => svg.children.filter((c) => c.name === 'path')
const isTint = (path: INode) => 'opacity' in path.attributes

describe('filled icon', () => {
  it('renders an svg with the right classes and paths', async () => {
    const svg = await render(HeartFilled, { class: 'extra' })
    expect(svg.name).toBe('svg')
    expect(svg.attributes).toMatchObject({ viewBox: '0 0 24 24', fill: 'none', class: 'applifted-icon applifted-icon-heart-filled extra' })
    for (const path of pathsOf(svg)) {
      expect(path.attributes.d).toBeTruthy()
      expect(path.attributes.fill).toBe('currentColor')
      expect(path.attributes.stroke).toBeUndefined()
    }
  })

  it('defaults to 24px and applies size and color', async () => {
    expect((await render(HeartFilled)).attributes.width).toBe('24')
    const svg = await render(HeartFilled, { size: 32, color: 'red' })
    expect([svg.attributes.width, svg.attributes.height]).toEqual(['32', '32'])
    for (const path of pathsOf(svg)) expect(path.attributes.fill).toBe('red')
  })

  it('is aria-hidden unless labelled, and passes other attributes through', async () => {
    expect((await render(HeartFilled)).attributes['aria-hidden']).toBe('true')
    const labelled = await render(HeartFilled, { 'aria-label': 'Liked', id: 'icon', style: 'display: block' })
    expect(labelled.attributes).toMatchObject({ 'aria-label': 'Liked', id: 'icon', style: 'display: block' })
    expect(labelled.attributes['aria-hidden']).toBeUndefined()
    expect((await render(HeartFilled, { 'aria-labelledby': 'title' })).attributes['aria-hidden']).toBeUndefined()
  })

  it('does not pass secondary props through as attributes', async () => {
    const svg = await render(HeartFilled, { secondaryColor: 'blue', secondaryOpacity: 0.4 })
    expect(Object.keys(svg.attributes).filter((n) => n.toLowerCase().includes('secondary'))).toEqual([])
  })

  it('renders slot content after the paths', async () => {
    const svg = await render(HeartFilled, {}, { default: '<title>Liked</title>' })
    expect(svg.children.at(-1)).toMatchObject({ name: 'title', children: [{ value: 'Liked' }] })
  })
})

describe('duotone icon', () => {
  it('renders tints first, at opacity 0.15 in the primary colour', async () => {
    const paths = pathsOf(await render(EighthNotesDuotone, { color: 'red' }))
    const kinds = paths.map((p) => (isTint(p) ? 'tint' : 'stroke'))
    expect(kinds.lastIndexOf('tint')).toBeLessThan(kinds.indexOf('stroke'))
    for (const tint of paths.filter(isTint)) expect([tint.attributes.fill, tint.attributes.opacity]).toEqual(['red', '0.15'])
    for (const stroke of paths.filter((p) => !isTint(p))) {
      expect([stroke.attributes.stroke, stroke.attributes.fill, stroke.attributes['stroke-width']]).toEqual(['red', 'none', '2'])
    }
  })

  it('applies secondary props to tints only, and ignores strokeWidth', async () => {
    const svg = await render(EighthNotesDuotone, { color: 'black', secondaryColor: 'blue', secondaryOpacity: 0.4, strokeWidth: 5, absoluteStrokeWidth: true })
    for (const tint of pathsOf(svg).filter(isTint)) expect([tint.attributes.fill, tint.attributes.opacity]).toEqual(['blue', '0.4'])
    for (const stroke of pathsOf(svg).filter((p) => !isTint(p))) expect([stroke.attributes.stroke, stroke.attributes['stroke-width']]).toEqual(['black', '2'])
    expect(Object.keys(svg.attributes).filter((n) => /secondary|stroke/i.test(n))).toEqual([])
  })
})

// Astro renders on the server only, so this is its parity check: the repo-level
// parity tests can't compile .astro files.
it('every icon renders the same SVG as in static', async () => {
  const staticIcons: Record<string, string> = stat
  const names = Object.keys(staticIcons).sort()
  expect(Object.keys(icons).sort()).toEqual(names)
  for (const name of names) {
    expect(await render((icons as Record<string, unknown>)[name]), name).toEqual(parseSync(staticIcons[name]!))
  }
}, 60_000)
