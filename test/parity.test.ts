// @vitest-environment jsdom
// Every package must render the same SVG for every icon: same elements, attributes,
// paths and order. lucide-extended-static is the reference.
import { createElement as h, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { parseSync } from 'svgson'
import { describe, expect, it } from 'vitest'
import * as js from '../packages/js/src/index.ts'
import * as react from '../packages/react/src/index.ts'
import * as stat from '../packages/static/src/index.ts'

const { createElement, createIcons: _createIcons, ...jsExports } = js
const jsIcons: Record<string, js.Icon> = jsExports
const staticIcons: Record<string, string> = stat
const reactIcons: Record<string, ComponentType> = react
const names = Object.keys(staticIcons).sort()

describe('parity across packages', () => {
  it('every package exports the same icon names', () => {
    expect(Object.keys(jsIcons).sort()).toEqual(names)
    expect(Object.keys(reactIcons).sort()).toEqual(names)
  })

  // svgson parses attributes into an object, so attribute order doesn't matter
  it('every icon renders the same SVG in every package', () => {
    for (const name of names) {
      const reference = parseSync(staticIcons[name])
      expect(parseSync(renderToStaticMarkup(h(reactIcons[name]))), `react ${name}`).toEqual(reference)
      expect(parseSync(createElement(jsIcons[name]).outerHTML), `js ${name}`).toEqual(reference)
    }
  })
})
