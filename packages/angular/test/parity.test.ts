// Every icon must render exactly as lucide-extended-static's SVG.
import { Component, type Type } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { parseSync } from 'svgson'
import { expect, it } from 'vitest'
import * as stat from '../../static/src/index.ts'
import * as exported from '../dist/index.js'

const { LxIcon, ...icons } = exported

it('every icon renders the same SVG as in static', () => {
  const staticIcons: Record<string, string> = stat
  const names = Object.keys(staticIcons).sort()
  expect(Object.keys(icons).sort()).toEqual(names)

  const list = names.map((name) => (icons as Record<string, unknown>)[name])
  const Host = Component({
    template: '@for (icon of list; track $index) { <svg [lxIcon]="$any(icon)"></svg> }',
    imports: [LxIcon],
  })(class { list = list }) as Type<unknown>
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const svgs = [...(fixture.nativeElement as HTMLElement).querySelectorAll(':scope > svg')]
  expect(svgs.length).toBe(names.length)
  // Angular marks control flow with comments
  names.forEach((name, i) => {
    expect(parseSync(svgs[i]!.outerHTML.replace(/<!--.*?-->/g, '')), name).toEqual(parseSync(staticIcons[name]!))
  })
}, 60_000)
