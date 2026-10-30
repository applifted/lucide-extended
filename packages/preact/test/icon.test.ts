import { createRef, h, render } from 'preact'
import { afterEach, describe, expect, it } from 'vitest'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

let container: HTMLElement
const mount = (vnode: ReturnType<typeof h>) => {
  container = document.createElement('div')
  render(vnode, container)
  return container.querySelector('svg')!
}
afterEach(() => render(null, container))

const pathsOf = (svg: Element) => [...svg.querySelectorAll('path')]
const isTint = (path: Element) => path.hasAttribute('opacity')

describe('filled icon', () => {
  it('renders an svg with the right classes and paths', () => {
    const svg = mount(h(HeartFilled, { class: 'extra' }))
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg.getAttribute('fill')).toBe('none')
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-heart-filled extra')
    for (const path of pathsOf(svg)) {
      expect(path.getAttribute('d')).toBeTruthy()
      expect(path.getAttribute('fill')).toBe('currentColor')
      expect(path.hasAttribute('stroke')).toBe(false)
    }
  })

  it('accepts className as well as class', () => {
    expect(mount(h(HeartFilled, { className: 'extra' })).getAttribute('class')).toBe('applifted-icon applifted-icon-heart-filled extra')
  })

  it('defaults to 24px and applies size and color', () => {
    expect(mount(h(HeartFilled, {})).getAttribute('width')).toBe('24')
    const svg = mount(h(HeartFilled, { size: 32, color: 'red' }))
    expect(svg.getAttribute('width')).toBe('32')
    expect(svg.getAttribute('height')).toBe('32')
    for (const path of pathsOf(svg)) expect(path.getAttribute('fill')).toBe('red')
  })

  it('is aria-hidden unless labelled', () => {
    expect(mount(h(HeartFilled, {})).getAttribute('aria-hidden')).toBe('true')
    const labelled = mount(h(HeartFilled, { 'aria-label': 'Liked' }))
    expect(labelled.getAttribute('aria-label')).toBe('Liked')
    expect(labelled.hasAttribute('aria-hidden')).toBe(false)
  })

  it('passes ref to the svg', () => {
    const ref = createRef<SVGSVGElement>()
    const svg = mount(h(HeartFilled, { ref }))
    expect(ref.current).toBe(svg)
  })
})

describe('duotone icon', () => {
  it('renders tints first, at opacity 0.15 in the primary colour', () => {
    const paths = pathsOf(mount(h(EighthNotesDuotone, { color: 'red' })))
    const kinds = paths.map((p) => (isTint(p) ? 'tint' : 'stroke'))
    expect(kinds.lastIndexOf('tint')).toBeLessThan(kinds.indexOf('stroke'))
    for (const tint of paths.filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['red', '0.15'])
    for (const stroke of paths.filter((p) => !isTint(p))) {
      expect([stroke.getAttribute('stroke'), stroke.getAttribute('fill'), stroke.getAttribute('stroke-width')]).toEqual(['red', 'none', '2'])
    }
  })

  it('applies secondaryColor and secondaryOpacity to tints only, and ignores strokeWidth', () => {
    const svg = mount(h(EighthNotesDuotone, { color: 'black', secondaryColor: 'blue', secondaryOpacity: 0.4, strokeWidth: 5, absoluteStrokeWidth: true }))
    for (const tint of pathsOf(svg).filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['blue', '0.4'])
    for (const stroke of pathsOf(svg).filter((p) => !isTint(p))) expect([stroke.getAttribute('stroke'), stroke.getAttribute('stroke-width')]).toEqual(['black', '2'])
    expect(svg.hasAttribute('strokeWidth') || svg.hasAttribute('absoluteStrokeWidth')).toBe(false)
  })
})
