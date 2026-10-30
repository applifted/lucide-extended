// Every icon must render in the browser exactly as lucide-extended-static's SVG.
// The repo-level parity test covers server rendering.
import { mount, unmount, type Component } from 'svelte'
import { parseSync } from 'svgson'
import { expect, it } from 'vitest'
import * as stat from '../../static/src/index.ts'
import * as icons from '../src/index.js'

const components: Record<string, Component> = icons

it('every icon renders the same SVG in the browser as in static', () => {
  const names = Object.keys(stat).sort()
  expect(Object.keys(components).sort()).toEqual(names)
  for (const name of names) {
    const target = document.createElement('div')
    const instance = mount(components[name], { target })
    expect(parseSync(target.innerHTML), name).toEqual(parseSync((stat as Record<string, string>)[name]))
    unmount(instance)
  }
})
