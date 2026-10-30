// @vitest-environment jsdom
// Every package must render the same SVG for every icon: same elements, attributes,
// paths and order. lucide-extended-static is the reference.
import { h as preactH, render as preactRender, type ComponentType as PreactComponent } from 'preact'
import { createElement as reactH, type ComponentType as ReactComponent } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { parseSync } from 'svgson'
import { describe, expect, it } from 'vitest'
import { h as vueH, render as vueRender, type Component as VueComponent } from 'vue'
import * as js from '../packages/js/src/index.ts'
import * as preact from '../packages/preact/src/index.ts'
import * as react from '../packages/react/src/index.ts'
import * as stat from '../packages/static/src/index.ts'
import * as vue from '../packages/vue/src/index.ts'

const { createElement, createIcons: _createIcons, ...jsExports } = js
const jsIcons: Record<string, js.Icon> = jsExports
const staticIcons: Record<string, string> = stat
const reactIcons: Record<string, ReactComponent> = react
const preactIcons: Record<string, PreactComponent> = preact
const vueIcons: Record<string, VueComponent> = vue
const names = Object.keys(staticIcons).sort()

// Renders into a detached element and returns its markup
function mount(render: (container: HTMLElement) => void): string {
  const container = document.createElement('div')
  render(container)
  return container.innerHTML
}

const renderers: Record<string, (name: string) => string> = {
  react: (name) => renderToStaticMarkup(reactH(reactIcons[name])),
  js: (name) => createElement(jsIcons[name]).outerHTML,
  preact: (name) => mount((c) => preactRender(preactH(preactIcons[name], {}), c)),
  vue: (name) => mount((c) => vueRender(vueH(vueIcons[name]), c)),
}

describe('parity across packages', () => {
  it('every package exports the same icon names', () => {
    expect(Object.keys(jsIcons).sort()).toEqual(names)
    expect(Object.keys(reactIcons).sort()).toEqual(names)
    expect(Object.keys(preactIcons).sort()).toEqual(names)
    expect(Object.keys(vueIcons).sort()).toEqual(names)
  })

  // svgson parses attributes into an object, so attribute order doesn't matter
  for (const [pkg, render] of Object.entries(renderers)) {
    it(`every icon renders the same SVG in ${pkg} as in static`, () => {
      for (const name of names) expect(parseSync(render(name)), `${pkg} ${name}`).toEqual(parseSync(staticIcons[name]))
    })
  }
})
