import { createRef } from 'react'
import { parseSync } from 'svgson'
import { describe, expect, it } from 'vitest'
import * as stat from '../../static/src/index.ts'
import * as icons from '../src/index.js'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'
import { render, toMarkup } from './render.js'

const isTint = (path: { props: Record<string, unknown> }) => 'opacity' in path.props

describe('filled icon', () => {
  it('renders an Svg with the paths, in black by default', () => {
    const { svg, paths } = render(HeartFilled)
    expect(svg.props).toMatchObject({ width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none' })
    expect(paths.length).toBeGreaterThan(0)
    for (const path of paths) {
      expect(path.props.d).toBeTruthy()
      expect(path.props.fill).toBe('black')
      expect(path.props.stroke).toBeUndefined()
    }
  })

  it('applies size and color', () => {
    const { svg, paths } = render(HeartFilled, { size: 32, color: 'red' })
    expect([svg.props.width, svg.props.height]).toEqual([32, 32])
    for (const path of paths) expect(path.props.fill).toBe('red')
  })

  it('is hidden from screen readers unless labelled', () => {
    expect(render(HeartFilled).svg.props).toMatchObject({ accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' })
    for (const label of [{ accessibilityLabel: 'Liked' }, { 'aria-label': 'Liked' }, { accessibilityLabelledBy: 'x' }, { 'aria-labelledby': 'x' }]) {
      const { props } = render(HeartFilled, label).svg
      expect(props).toMatchObject({ ...label, accessible: true, accessibilityRole: 'image' })
      expect(props.accessibilityElementsHidden).toBeUndefined()
      expect(props.importantForAccessibility).toBeUndefined()
    }
  })

  it('passes other props through, so they can override the defaults', () => {
    const style = { margin: 4 }
    const { props } = render(HeartFilled, { testID: 'icon', style, accessibilityRole: 'button', accessibilityLabel: 'Like' }).svg
    expect(props).toMatchObject({ testID: 'icon', style, accessibilityRole: 'button' })
  })

  it('passes the ref to the Svg, and renders children after the paths', () => {
    const ref = createRef()
    const { svg, children } = render(HeartFilled, { children: 'title' }, ref)
    expect((svg as unknown as { ref: unknown }).ref ?? svg.props.ref).toBe(ref)
    expect(children.at(-1)).toBe('title')
  })
})

describe('duotone icon', () => {
  it('renders tints first, at opacity 0.15 in the primary colour', () => {
    const { paths } = render(EighthNotesDuotone, { color: 'red' })
    const kinds = paths.map((p) => (isTint(p) ? 'tint' : 'stroke'))
    expect(kinds.lastIndexOf('tint')).toBeLessThan(kinds.indexOf('stroke'))
    for (const tint of paths.filter(isTint)) expect([tint.props.fill, tint.props.opacity]).toEqual(['red', 0.15])
    for (const stroke of paths.filter((p) => !isTint(p))) {
      expect([stroke.props.stroke, stroke.props.fill, stroke.props.strokeWidth]).toEqual(['red', 'none', 2])
    }
  })

  it('applies secondary props to tints only, and ignores strokeWidth', () => {
    const { svg, paths } = render(EighthNotesDuotone, { color: 'black', secondaryColor: 'blue', secondaryOpacity: 0.4, strokeWidth: 5, absoluteStrokeWidth: true })
    for (const tint of paths.filter(isTint)) expect([tint.props.fill, tint.props.opacity]).toEqual(['blue', 0.4])
    for (const stroke of paths.filter((p) => !isTint(p))) expect([stroke.props.stroke, stroke.props.strokeWidth]).toEqual(['black', 2])
    expect(Object.keys(svg.props).filter((n) => /secondary|stroke/i.test(n))).toEqual([])
  })
})

// React Native has no classes or aria-hidden, so those are left out of the comparison
it('every icon draws the same SVG as in static', () => {
  const staticIcons: Record<string, string> = stat
  const names = Object.keys(staticIcons).sort()
  expect(Object.keys(icons).sort()).toEqual(names)
  for (const name of names) {
    const expected = parseSync(staticIcons[name]!)
    for (const key of ['xmlns', 'class', 'aria-hidden']) delete expected.attributes[key]
    expect(parseSync(toMarkup((icons as Record<string, unknown>)[name], { color: 'currentColor' })), name).toEqual(expected)
  }
})
