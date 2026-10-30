import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { createComponent, createSignal, type Component } from 'solid-js'
import { hydrate, render } from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

let dispose: (() => void) | undefined
const mount = (component: Component<any>, props: Record<string, unknown> = {}) => {
  const container = document.createElement('div')
  dispose = render(() => createComponent(component, props), container)
  return container.querySelector('svg')!
}
afterEach(() => {
  dispose?.()
  dispose = undefined
})

const pathsOf = (svg: Element) => [...svg.querySelectorAll('path')]
const isTint = (path: Element) => path.hasAttribute('opacity')

describe('filled icon', () => {
  it('renders an svg with the right classes and paths', () => {
    const svg = mount(HeartFilled, { class: 'extra' })
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
    expect(mount(HeartFilled).getAttribute('width')).toBe('24')
    const svg = mount(HeartFilled, { size: 32, color: 'red' })
    expect(svg.getAttribute('width')).toBe('32')
    expect(svg.getAttribute('height')).toBe('32')
    for (const path of pathsOf(svg)) expect(path.getAttribute('fill')).toBe('red')
  })

  it('is aria-hidden unless labelled, and passes other attributes through', () => {
    expect(mount(HeartFilled).getAttribute('aria-hidden')).toBe('true')
    const labelled = mount(HeartFilled, { 'aria-label': 'Liked', id: 'icon', style: { display: 'block' } })
    expect(labelled.getAttribute('aria-label')).toBe('Liked')
    expect(labelled.hasAttribute('aria-hidden')).toBe(false)
    expect(labelled.id).toBe('icon')
    expect(labelled.getAttribute('style')).toBe('display: block;')
    expect(mount(HeartFilled, { 'aria-labelledby': 'title' }).hasAttribute('aria-hidden')).toBe(false)
  })

  it('does not pass secondary props through as attributes', () => {
    const svg = mount(HeartFilled, { secondaryColor: 'blue', secondaryOpacity: 0.4 })
    expect(svg.getAttributeNames().filter((n) => n.toLowerCase().includes('secondary'))).toEqual([])
  })

  it('passes ref the <svg>, and renders children after the paths', () => {
    let ref: SVGSVGElement | undefined
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
    const svg = mount(HeartFilled, { ref: (el: SVGSVGElement) => (ref = el), children: title })
    expect(ref).toBe(svg)
    expect(svg.lastElementChild).toBe(title)
  })
})

describe('duotone icon', () => {
  it('renders tints first, at opacity 0.15 in the primary colour', () => {
    const paths = pathsOf(mount(EighthNotesDuotone, { color: 'red' }))
    const kinds = paths.map((p) => (isTint(p) ? 'tint' : 'stroke'))
    expect(kinds.lastIndexOf('tint')).toBeLessThan(kinds.indexOf('stroke'))
    for (const tint of paths.filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['red', '0.15'])
    for (const stroke of paths.filter((p) => !isTint(p))) {
      expect([stroke.getAttribute('stroke'), stroke.getAttribute('fill'), stroke.getAttribute('stroke-width')]).toEqual(['red', 'none', '2'])
    }
  })

  it('applies secondary props to tints only, and ignores strokeWidth', () => {
    const svg = mount(EighthNotesDuotone, { color: 'black', secondaryColor: 'blue', secondaryOpacity: 0.4, strokeWidth: 5, absoluteStrokeWidth: true })
    for (const tint of pathsOf(svg).filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['blue', '0.4'])
    for (const stroke of pathsOf(svg).filter((p) => !isTint(p))) expect([stroke.getAttribute('stroke'), stroke.getAttribute('stroke-width')]).toEqual(['black', '2'])
    expect(svg.getAttributeNames().filter((n) => /secondary|stroke/i.test(n))).toEqual([])
  })

  it('updates in place when signals change after mount', () => {
    const [size, setSize] = createSignal(24)
    const [color, setColor] = createSignal('red')
    const [opacity, setOpacity] = createSignal(0.15)
    const [className, setClassName] = createSignal('a')
    const svg = mount(EighthNotesDuotone, {
      get size() { return size() },
      get color() { return color() },
      get secondaryOpacity() { return opacity() },
      get class() { return className() },
    })
    const tint = pathsOf(svg).find(isTint)!
    setSize(48)
    setColor('green')
    setOpacity(0.5)
    setClassName('b')
    expect(svg.getAttribute('width')).toBe('48')
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-eighth-notes-duotone b')
    expect(pathsOf(svg).find(isTint)).toBe(tint)
    expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['green', '0.5'])
    expect(pathsOf(svg).find((p) => !isTint(p))!.getAttribute('stroke')).toBe('green')
  })
})

describe('hydration', () => {
  it('hydrates server markup without re-rendering, and stays reactive', () => {
    const props = { color: 'red', 'aria-label': 'Music' }
    const script = path.resolve(import.meta.dirname, 'fixtures/ssr/render.ts')
    const { html, script: hydrationScript } = JSON.parse(execFileSync('npx', ['tsx', script, JSON.stringify(props)], { encoding: 'utf8' }))
    expect(html).toContain('data-hk=')
    // What <HydrationScript /> puts in the page head
    new Function(hydrationScript.match(/<script[^>]*>([\s\S]*?)<\/script>/)![1])()

    const container = document.createElement('div')
    container.innerHTML = html
    const serverSvg = container.querySelector('svg')!
    const serverPaths = pathsOf(serverSvg)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    const [color, setColor] = createSignal('red')
    dispose = hydrate(() => createComponent(EighthNotesDuotone, { ...props, get color() { return color() } }), container)

    expect(warn).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
    expect(container.querySelector('svg')).toBe(serverSvg)
    expect(pathsOf(serverSvg)).toEqual(serverPaths)
    setColor('green')
    expect(serverPaths.find(isTint)!.getAttribute('fill')).toBe('green')
    expect(serverSvg.hasAttribute('aria-hidden')).toBe(false)
    warn.mockRestore()
    error.mockRestore()
  }, 30_000)
})
