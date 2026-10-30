// Every icon must render in the browser exactly as lucide-extended-static's SVG.
// The repo-level parity test covers server rendering.
import { parseSync } from 'svgson'
import { createComponent, type Component } from 'solid-js'
import { render } from 'solid-js/web'
import { expect, it } from 'vitest'
import * as stat from '../../static/src/index.ts'
import * as icons from '../src/index.js'

const components: Record<string, Component> = icons

it('every icon renders the same SVG in the browser as in static', () => {
  const names = Object.keys(stat).sort()
  expect(Object.keys(components).sort()).toEqual(names)
  for (const name of names) {
    const container = document.createElement('div')
    const dispose = render(() => createComponent(components[name]!, {}), container)
    expect(parseSync(container.innerHTML), name).toEqual(parseSync((stat as Record<string, string>)[name]!))
    dispose()
  }
})
