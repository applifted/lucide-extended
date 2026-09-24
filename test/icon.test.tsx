import { createRef } from 'react'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HeartFilled, MusicDuotone } from '../src/index.js'

afterEach(cleanup)

const svgOf = (container: HTMLElement) => container.querySelector('svg')!
const pathsOf = (container: HTMLElement) => [...container.querySelectorAll('path')]

describe('filled icon', () => {
  it('renders an svg with the right classes and paths', () => {
    const { container } = render(<HeartFilled className="extra" />)
    const svg = svgOf(container)
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg.getAttribute('fill')).toBe('none')
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-heart-filled extra')
    const paths = pathsOf(container)
    expect(paths.length).toBeGreaterThan(0)
    for (const path of paths) {
      expect(path.getAttribute('d')).toBeTruthy()
      expect(path.getAttribute('fill')).toBe('currentColor')
      expect(path.hasAttribute('stroke')).toBe(false)
    }
  })

  it('applies size and color', () => {
    const { container } = render(<HeartFilled size={32} color="red" />)
    const svg = svgOf(container)
    expect(svg.getAttribute('width')).toBe('32')
    expect(svg.getAttribute('height')).toBe('32')
    for (const path of pathsOf(container)) expect(path.getAttribute('fill')).toBe('red')
  })

  it('defaults to 24px', () => {
    const svg = svgOf(render(<HeartFilled />).container)
    expect(svg.getAttribute('width')).toBe('24')
    expect(svg.getAttribute('height')).toBe('24')
  })

  it('forwards ref to the svg element', () => {
    const ref = createRef<SVGSVGElement>()
    const { container } = render(<HeartFilled ref={ref} />)
    expect(ref.current).toBe(svgOf(container))
  })

  it('sets aria-hidden by default', () => {
    expect(svgOf(render(<HeartFilled />).container).getAttribute('aria-hidden')).toBe('true')
  })

  it('omits aria-hidden when aria-label or aria-labelledby is given', () => {
    const labelled = svgOf(render(<HeartFilled aria-label="Like" />).container)
    expect(labelled.hasAttribute('aria-hidden')).toBe(false)
    expect(labelled.getAttribute('aria-label')).toBe('Like')
    cleanup()
    const labelledBy = svgOf(render(<HeartFilled aria-labelledby="caption" />).container)
    expect(labelledBy.hasAttribute('aria-hidden')).toBe(false)
  })

  it('does not pass strokeWidth or absoluteStrokeWidth to the DOM', () => {
    const { container } = render(<HeartFilled strokeWidth={3} absoluteStrokeWidth />)
    for (const el of [svgOf(container), ...pathsOf(container)]) {
      expect(el.hasAttribute('stroke-width')).toBe(false)
      expect(el.hasAttribute('strokewidth')).toBe(false)
      expect(el.hasAttribute('absolutestrokewidth')).toBe(false)
      expect(el.hasAttribute('absoluteStrokeWidth')).toBe(false)
    }
  })

  it('sets displayName', () => {
    expect(HeartFilled.displayName).toBe('HeartFilled')
  })
})

describe('duotone icon', () => {
  const byKind = (container: HTMLElement) => {
    const paths = pathsOf(container)
    return {
      paths,
      tints: paths.filter((p) => p.hasAttribute('opacity')),
      strokes: paths.filter((p) => p.hasAttribute('stroke')),
    }
  }

  it('renders tint paths at opacity 0.15 in the primary colour', () => {
    const { container } = render(<MusicDuotone color="red" />)
    const { tints, strokes } = byKind(container)
    expect(tints.length).toBeGreaterThan(0)
    expect(strokes.length).toBeGreaterThan(0)
    for (const tint of tints) {
      expect(tint.getAttribute('opacity')).toBe('0.15')
      expect(tint.getAttribute('fill')).toBe('red')
    }
    for (const stroke of strokes) {
      expect(stroke.getAttribute('fill')).toBe('none')
      expect(stroke.getAttribute('stroke')).toBe('red')
      expect(stroke.getAttribute('stroke-width')).toBe('2')
      expect(stroke.getAttribute('stroke-linecap')).toBe('round')
      expect(stroke.getAttribute('stroke-linejoin')).toBe('round')
    }
  })

  it('applies secondaryColor and secondaryOpacity to tints only', () => {
    const { container } = render(<MusicDuotone color="black" secondaryColor="blue" secondaryOpacity={0.4} />)
    const { tints, strokes } = byKind(container)
    for (const tint of tints) {
      expect(tint.getAttribute('fill')).toBe('blue')
      expect(tint.getAttribute('opacity')).toBe('0.4')
    }
    for (const stroke of strokes) {
      expect(stroke.getAttribute('stroke')).toBe('black')
      expect(stroke.hasAttribute('opacity')).toBe(false)
    }
  })

  it('renders tint paths before stroke paths', () => {
    const { container } = render(<MusicDuotone />)
    const kinds = pathsOf(container).map((p) => (p.hasAttribute('opacity') ? 'tint' : 'stroke'))
    const lastTint = kinds.lastIndexOf('tint')
    const firstStroke = kinds.indexOf('stroke')
    expect(lastTint).toBeGreaterThanOrEqual(0)
    expect(lastTint).toBeLessThan(firstStroke)
  })

  it('uses the duotone class name', () => {
    const svg = svgOf(render(<MusicDuotone />).container)
    expect(svg.getAttribute('class')).toBe('applifted-icon applifted-icon-music-duotone')
  })
})
