import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick, reactive, render, type VNode } from 'vue'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

let container: HTMLElement
const mount = (vnode: VNode | (() => VNode)) => {
  container = document.createElement('div')
  render(typeof vnode === 'function' ? h({ render: vnode }) : vnode, container)
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

  it('defaults to 24px and applies size and color', () => {
    expect(mount(h(HeartFilled)).getAttribute('width')).toBe('24')
    const svg = mount(h(HeartFilled, { size: 32, color: 'red' }))
    expect(svg.getAttribute('width')).toBe('32')
    expect(svg.getAttribute('height')).toBe('32')
    for (const path of pathsOf(svg)) expect(path.getAttribute('fill')).toBe('red')
  })

  it('is aria-hidden unless labelled, and passes other attributes through', () => {
    expect(mount(h(HeartFilled)).getAttribute('aria-hidden')).toBe('true')
    const labelled = mount(h(HeartFilled, { 'aria-label': 'Liked', id: 'icon', style: 'display: block' }))
    expect(labelled.getAttribute('aria-label')).toBe('Liked')
    expect(labelled.hasAttribute('aria-hidden')).toBe(false)
    expect(labelled.id).toBe('icon')
    expect(labelled.getAttribute('style')).toBe('display: block;')
  })

  it('does not pass secondary props through as attributes', () => {
    const svg = mount(h(HeartFilled, { secondaryColor: 'blue' } as Record<string, unknown>))
    expect(svg.getAttributeNames().filter((n) => n.toLowerCase().includes('secondary'))).toEqual([])
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

  it('applies secondary props to tints only, in camelCase or kebab-case, and ignores strokeWidth', () => {
    for (const props of [
      { color: 'black', secondaryColor: 'blue', secondaryOpacity: 0.4, strokeWidth: 5 },
      { color: 'black', 'secondary-color': 'blue', 'secondary-opacity': 0.4, 'stroke-width': 5 },
    ]) {
      const svg = mount(h(EighthNotesDuotone, props))
      for (const tint of pathsOf(svg).filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['blue', '0.4'])
      for (const stroke of pathsOf(svg).filter((p) => !isTint(p))) expect([stroke.getAttribute('stroke'), stroke.getAttribute('stroke-width')]).toEqual(['black', '2'])
      expect(svg.getAttributeNames().filter((n) => /secondary|stroke/i.test(n))).toEqual([])
    }
  })

  it('updates when props change', async () => {
    const state = reactive({ size: 24, color: 'red', secondaryOpacity: 0.15 })
    const svg = mount(() => h(EighthNotesDuotone, { ...state }))
    Object.assign(state, { size: 48, color: 'green', secondaryOpacity: 0.5 })
    await nextTick()
    expect(svg.getAttribute('width')).toBe('48')
    expect(pathsOf(svg).find(isTint)!.getAttribute('fill')).toBe('green')
    expect(pathsOf(svg).find(isTint)!.getAttribute('opacity')).toBe('0.5')
  })
})
