import { Component, signal, type Type } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { describe, expect, it } from 'vitest'
import { EighthNotesDuotone, HeartFilled, LxIcon } from '../dist/index.js'

// Renders a host template and returns its first <svg>. Components are declared by
// calling Component() directly, as the tests run without a decorator transform.
function mount(template: string, state: Record<string, unknown> = {}) {
  const Host = Component({ template, imports: [LxIcon] })(class { HeartFilled = HeartFilled; EighthNotesDuotone = EighthNotesDuotone; state = state }) as Type<unknown>
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return { fixture, svg: (fixture.nativeElement as HTMLElement).querySelector('svg')! }
}

const pathsOf = (svg: Element) => [...svg.querySelectorAll('path')]
const isTint = (path: Element) => path.hasAttribute('opacity')

describe('filled icon', () => {
  it('renders into the <svg> with the right classes and paths', () => {
    const { svg } = mount('<svg [lxIcon]="HeartFilled" class="extra"></svg>')
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg.getAttribute('fill')).toBe('none')
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-heart-filled extra')
    expect(pathsOf(svg).length).toBeGreaterThan(0)
    for (const path of pathsOf(svg)) {
      expect(path.namespaceURI).toBe('http://www.w3.org/2000/svg')
      expect(path.getAttribute('d')).toBeTruthy()
      expect(path.getAttribute('fill')).toBe('currentColor')
      expect(path.hasAttribute('stroke')).toBe(false)
    }
  })

  it('defaults to 24px and applies size and color', () => {
    expect(mount('<svg [lxIcon]="HeartFilled"></svg>').svg.getAttribute('width')).toBe('24')
    const { svg } = mount('<svg [lxIcon]="HeartFilled" [size]="32" color="red"></svg>')
    expect([svg.getAttribute('width'), svg.getAttribute('height')]).toEqual(['32', '32'])
    for (const path of pathsOf(svg)) expect(path.getAttribute('fill')).toBe('red')
  })

  it('is aria-hidden unless labelled, and keeps other attributes', () => {
    expect(mount('<svg [lxIcon]="HeartFilled"></svg>').svg.getAttribute('aria-hidden')).toBe('true')
    const { svg } = mount('<svg [lxIcon]="HeartFilled" aria-label="Liked" id="icon" style="display: block"></svg>')
    expect(svg.getAttribute('aria-label')).toBe('Liked')
    expect(svg.hasAttribute('aria-hidden')).toBe(false)
    expect(svg.id).toBe('icon')
    expect(svg.getAttribute('style')).toBe('display: block;')
    expect(mount('<svg [lxIcon]="HeartFilled" aria-labelledby="t"></svg>').svg.hasAttribute('aria-hidden')).toBe(false)
  })

  // Bound with [], as Angular also keeps a static attribute (secondaryColor="blue") on the element
  it('ignores secondary inputs', () => {
    const { svg } = mount('<svg [lxIcon]="HeartFilled" [secondaryColor]="\'blue\'" [secondaryOpacity]="0.4"></svg>')
    expect(svg.getAttributeNames().filter((n) => n.toLowerCase().includes('secondary'))).toEqual([])
    for (const path of pathsOf(svg)) expect([path.getAttribute('fill'), path.hasAttribute('opacity')]).toEqual(['currentColor', false])
  })

  it('projects content after the paths', () => {
    const { svg } = mount('<svg [lxIcon]="HeartFilled"><title>Liked</title></svg>')
    expect(svg.lastElementChild!.tagName).toBe('title')
    expect(svg.lastElementChild!.textContent).toBe('Liked')
  })
})

describe('duotone icon', () => {
  it('renders tints first, at opacity 0.15 in the primary colour', () => {
    const paths = pathsOf(mount('<svg [lxIcon]="EighthNotesDuotone" color="red"></svg>').svg)
    const kinds = paths.map((p) => (isTint(p) ? 'tint' : 'stroke'))
    expect(kinds.lastIndexOf('tint')).toBeLessThan(kinds.indexOf('stroke'))
    for (const tint of paths.filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['red', '0.15'])
    for (const stroke of paths.filter((p) => !isTint(p))) {
      expect([stroke.getAttribute('stroke'), stroke.getAttribute('fill'), stroke.getAttribute('stroke-width')]).toEqual(['red', 'none', '2'])
    }
  })

  it('applies secondary inputs to tints only, and ignores strokeWidth', () => {
    const { svg } = mount(
      '<svg [lxIcon]="EighthNotesDuotone" color="black" [secondaryColor]="\'blue\'" [secondaryOpacity]="0.4" [strokeWidth]="5" [absoluteStrokeWidth]="true"></svg>',
    )
    for (const tint of pathsOf(svg).filter(isTint)) expect([tint.getAttribute('fill'), tint.getAttribute('opacity')]).toEqual(['blue', '0.4'])
    for (const stroke of pathsOf(svg).filter((p) => !isTint(p))) expect([stroke.getAttribute('stroke'), stroke.getAttribute('stroke-width')]).toEqual(['black', '2'])
    expect(svg.getAttributeNames().filter((n) => /secondary|stroke/i.test(n))).toEqual([])
  })

  it('updates when inputs change, including the icon', () => {
    const state = { icon: signal<unknown>(EighthNotesDuotone), size: signal(24), color: signal('red'), opacity: signal(0.15), label: signal<string | null>(null) }
    const { fixture, svg } = mount(
      '<svg [lxIcon]="$any(state.icon())" [size]="state.size()" [color]="state.color()" [secondaryOpacity]="state.opacity()" [aria-label]="state.label()"></svg>',
      state,
    )
    state.size.set(48)
    state.color.set('green')
    state.opacity.set(0.5)
    state.label.set('Music')
    fixture.detectChanges()
    expect(svg.getAttribute('width')).toBe('48')
    expect([pathsOf(svg).find(isTint)!.getAttribute('fill'), pathsOf(svg).find(isTint)!.getAttribute('opacity')]).toEqual(['green', '0.5'])
    expect([svg.getAttribute('aria-label'), svg.hasAttribute('aria-hidden')]).toEqual(['Music', false])
    state.icon.set(HeartFilled)
    fixture.detectChanges()
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-heart-filled')
    expect(pathsOf(svg).every((p) => p.getAttribute('fill') === 'green' && !isTint(p))).toBe(true)
  })
})
