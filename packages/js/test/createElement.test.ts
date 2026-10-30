import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement, createIcons, EighthNotesDuotone, HeartFilled, AlertCircleFilled } from '../src/index.js'

const pathsOf = (svg: Element) => [...svg.querySelectorAll('path')]
const isTint = (path: Element) => path.hasAttribute('opacity')

describe('createElement: filled icon', () => {
  it('builds an svg with the right classes and paths', () => {
    const svg = createElement(HeartFilled, { class: 'extra' })
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg.getAttribute('fill')).toBe('none')
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-heart-filled extra')
    const paths = pathsOf(svg)
    expect(paths.length).toBeGreaterThan(0)
    for (const path of paths) {
      expect(path.getAttribute('d')).toBeTruthy()
      expect(path.getAttribute('fill')).toBe('currentColor')
      expect(path.hasAttribute('stroke')).toBe(false)
    }
  })

  it('defaults to 24px and applies size and color', () => {
    expect(createElement(HeartFilled).getAttribute('width')).toBe('24')
    const svg = createElement(HeartFilled, { size: 32, color: 'red' })
    expect(svg.getAttribute('width')).toBe('32')
    expect(svg.getAttribute('height')).toBe('32')
    for (const path of pathsOf(svg)) expect(path.getAttribute('fill')).toBe('red')
  })

  it('is aria-hidden unless labelled', () => {
    expect(createElement(HeartFilled).getAttribute('aria-hidden')).toBe('true')
    const labelled = createElement(HeartFilled, { 'aria-label': 'Liked' })
    expect(labelled.getAttribute('aria-label')).toBe('Liked')
    expect(labelled.hasAttribute('aria-hidden')).toBe(false)
    expect(createElement(HeartFilled, { 'aria-labelledby': 'x' }).hasAttribute('aria-hidden')).toBe(false)
  })

  it('sets other attributes and ignores strokeWidth', () => {
    const svg = createElement(EighthNotesDuotone, { id: 'icon', strokeWidth: 5, absoluteStrokeWidth: true })
    expect(svg.id).toBe('icon')
    expect(svg.hasAttribute('strokeWidth')).toBe(false)
    expect(svg.hasAttribute('absoluteStrokeWidth')).toBe(false)
    for (const path of pathsOf(svg).filter((p) => !isTint(p))) expect(path.getAttribute('stroke-width')).toBe('2')
  })
})

describe('createElement: duotone icon', () => {
  it('renders tints first, at opacity 0.15 in the primary colour', () => {
    const paths = pathsOf(createElement(EighthNotesDuotone, { color: 'red' }))
    const kinds = paths.map((p) => (isTint(p) ? 'tint' : 'stroke'))
    expect(kinds.lastIndexOf('tint')).toBeLessThan(kinds.indexOf('stroke'))
    for (const tint of paths.filter(isTint)) {
      expect(tint.getAttribute('fill')).toBe('red')
      expect(tint.getAttribute('opacity')).toBe('0.15')
    }
    for (const stroke of paths.filter((p) => !isTint(p))) {
      expect(stroke.getAttribute('stroke')).toBe('red')
      expect(stroke.getAttribute('fill')).toBe('none')
    }
  })

  it('applies secondaryColor and secondaryOpacity to tints only', () => {
    const paths = pathsOf(createElement(EighthNotesDuotone, { color: 'black', secondaryColor: 'blue', secondaryOpacity: 0.4 }))
    for (const tint of paths.filter(isTint)) {
      expect(tint.getAttribute('fill')).toBe('blue')
      expect(tint.getAttribute('opacity')).toBe('0.4')
    }
    for (const stroke of paths.filter((p) => !isTint(p))) expect(stroke.getAttribute('stroke')).toBe('black')
  })
})

describe('createIcons', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('replaces placeholders, keeping their attributes', () => {
    document.body.innerHTML = '<i data-lucide-extended="heart-filled" class="mine" width="40"></i>'
    createIcons({ icons: { HeartFilled }, attrs: { class: 'shared', color: 'red' } })
    const svg = document.querySelector('svg')!
    expect(document.querySelector('i')).toBeNull()
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-heart-filled shared mine')
    expect(svg.getAttribute('width')).toBe('40')
    expect(svg.getAttribute('data-lucide-extended')).toBe('heart-filled')
    expect(svg.querySelector('path')!.getAttribute('fill')).toBe('red')
  })

  it('finds aliases by their own name', () => {
    document.body.innerHTML = '<i data-lucide-extended="alert-circle-filled"></i>'
    createIcons({ icons: { AlertCircleFilled } })
    expect(document.querySelector('svg')!.getAttribute('class')).toContain('applifted-icon-circle-alert-filled')
  })

  it('leaves unknown icons in place and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    document.body.innerHTML = '<i data-lucide-extended="star-filled"></i>'
    createIcons({ icons: { HeartFilled } })
    expect(document.querySelector('i')).not.toBeNull()
    expect(warn).toHaveBeenCalledOnce()
  })

  it('limits the search to root', () => {
    document.body.innerHTML = '<div id="a"><i data-lucide-extended="heart-filled"></i></div><i data-lucide-extended="heart-filled"></i>'
    createIcons({ icons: { HeartFilled }, root: document.getElementById('a')! })
    expect(document.querySelectorAll('svg')).toHaveLength(1)
    expect(document.querySelectorAll('i')).toHaveLength(1)
  })
})
