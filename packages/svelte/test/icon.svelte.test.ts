import { flushSync, mount, unmount, type Component } from 'svelte'
import { afterEach, describe, expect, it } from 'vitest'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

let instance: ReturnType<typeof mount> | undefined
const render = (component: Component<any>, props: Record<string, unknown> = {}) => {
  const target = document.createElement('div')
  instance = mount(component, { target, props })
  return target.querySelector('svg')!
}
afterEach(() => {
  if (instance) unmount(instance)
  instance = undefined
})

const pathsOf = (svg: Element) => [...svg.querySelectorAll('path')]
const isTint = (path: Element) => path.hasAttribute('opacity')

describe('filled icon', () => {
  it('renders an svg with the right classes and paths', () => {
    const svg = render(HeartFilled, { class: 'extra' })
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg.getAttribute('fill')).toBe('none')
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-heart-filled extra')
    for (const path of pathsOf(svg)) {
      expect(path.namespaceURI).toBe('http://www.w3.org/2000/svg')
      expect(path.getAttribute('d')).toBeTruthy()
      expect(path.getAttribute('fill')).toBe('currentColor')
      expect(path.hasAttribute('stroke')).toBe(false)
    }
  })

  it('defaults to 24px and applies size and color', () => {
    expect(render(HeartFilled).getAttribute('width')).toBe('24')
    const svg = render(HeartFilled, { size: 32, color: 'red' })
    expect(svg.getAttribute('width')).toBe('32')
    expect(svg.getAttribute('height')).toBe('32')
    for (const path of pathsOf(svg)) expect(path.getAttribute('fill')).toBe('red')
  })

  it('is aria-hidden unless labelled, and passes other attributes through', () => {
    expect(render(HeartFilled).getAttribute('aria-hidden')).toBe('true')
    const labelled = render(HeartFilled, { 'aria-label': 'Liked', id: 'icon', style: 'display: block' })
    expect(labelled.getAttribute('aria-label')).toBe('Liked')
    expect(labelled.hasAttribute('aria-hidden')).toBe(false)
    expect(labelled.id).toBe('icon')
    expect(labelled.getAttribute('style')).toBe('display: block;')
    expect(render(HeartFilled, { 'aria-labelledby': 'title' }).hasAttribute('aria-hidden')).toBe(false)
  })

  it('does not pass secondary props through as attributes', () => {
    const svg = render(HeartFilled, { secondaryColor: 'blue', secondaryOpacity: 0.4 })
    expect(svg.getAttributeNames().filter((n) => n.toLowerCase().includes('secondary'))).toEqual([])
  })
})

describe('duotone icon', () => {
  it('renders tints first, at opacity 0.15 in the primary colour', () => {
    const paths = pathsOf(render(EighthNotesDuotone, { color: 'red' }))
    const kinds = paths.map((p) => (isTint(p) ? 'tint' : 'stroke'))
    expect(kinds.lastIndexOf('tint')).toBeLessThan(kinds.indexOf('stroke'))
    for (const tint of paths.filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['red', '0.15'])
    for (const stroke of paths.filter((p) => !isTint(p))) {
      expect([stroke.getAttribute('stroke'), stroke.getAttribute('fill'), stroke.getAttribute('stroke-width')]).toEqual(['red', 'none', '2'])
    }
  })

  it('applies secondary props to tints only, and ignores strokeWidth', () => {
    const svg = render(EighthNotesDuotone, { color: 'black', secondaryColor: 'blue', secondaryOpacity: 0.4, strokeWidth: 5, absoluteStrokeWidth: true })
    for (const tint of pathsOf(svg).filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['blue', '0.4'])
    for (const stroke of pathsOf(svg).filter((p) => !isTint(p))) expect([stroke.getAttribute('stroke'), stroke.getAttribute('stroke-width')]).toEqual(['black', '2'])
    expect(svg.getAttributeNames().filter((n) => /secondary|stroke/i.test(n))).toEqual([])
  })

  it('updates when props change', () => {
    const props = $state({ size: 24, color: 'red', secondaryOpacity: 0.15, class: 'a' })
    const svg = render(EighthNotesDuotone, props)
    Object.assign(props, { size: 48, color: 'green', secondaryOpacity: 0.5, class: 'b' })
    flushSync()
    expect(svg.getAttribute('width')).toBe('48')
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-eighth-notes-duotone b')
    expect(pathsOf(svg).find(isTint)!.getAttribute('fill')).toBe('green')
    expect(pathsOf(svg).find(isTint)!.getAttribute('opacity')).toBe('0.5')
    expect(pathsOf(svg).find((p) => !isTint(p))!.getAttribute('stroke')).toBe('green')
  })
})
