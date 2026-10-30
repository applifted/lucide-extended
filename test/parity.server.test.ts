// The parity check of test/parity.test.ts for packages whose server render differs
// from their browser render: Solid and Svelte, rendered through their server builds
// in Node. Each package checks its browser render against static in its own tests.
import { parseSync } from 'svgson'
import { createComponent, type Component as SolidComponent } from 'solid-js'
import { NoHydration, renderToString } from 'solid-js/web'
import type { Component as SvelteComponent } from 'svelte'
import { render as svelteRender } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import * as solid from '../packages/solid/src/index.ts'
import * as stat from '../packages/static/src/index.ts'
import * as svelte from '../packages/svelte/src/index.ts'

const staticIcons: Record<string, string> = stat
const solidIcons: Record<string, SolidComponent> = solid
const svelteIcons: Record<string, SvelteComponent> = svelte
const names = Object.keys(staticIcons).sort()

const packages: Record<string, { icons: Record<string, unknown>; render: (name: string) => string }> = {
  solid: {
    icons: solidIcons,
    // Solid's server output ends a class list with a space
    render: (name) =>
      renderToString(() => createComponent(NoHydration, { get children() { return createComponent(solidIcons[name]!, {}) } }))
        .replace(/ class="([^"]*?) "/, ' class="$1"'),
  },
  svelte: {
    icons: svelteIcons,
    // Svelte marks its blocks with comments in server output
    render: (name) => svelteRender(svelteIcons[name]!).body.replace(/<!--.*?-->/g, ''),
  },
}

describe('parity across packages, server rendering', () => {
  for (const [pkg, { icons, render }] of Object.entries(packages)) {
    it(`${pkg} exports the same icon names as static`, () => {
      expect(Object.keys(icons).sort()).toEqual(names)
    })

    // svgson parses attributes into an object, so attribute order doesn't matter
    it(`every icon renders the same SVG in ${pkg} as in static`, () => {
      for (const name of names) expect(parseSync(render(name)), `${pkg} ${name}`).toEqual(parseSync(staticIcons[name]!))
    })
  }
})
