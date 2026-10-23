import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import * as icons from '../src/index.js'

const root = path.resolve(import.meta.dirname, '..')
const countSvgs = (variant: string) =>
  readdirSync(path.join(root, 'svg', variant)).filter((f) => f.endsWith('.svg')).length

const names = Object.keys(icons)

describe('exports', () => {
  it('every export ends in Filled or Duotone', () => {
    const bad = names.filter((n) => !/^[A-Z][A-Za-z0-9]*(Filled|Duotone)$/.test(n))
    expect(bad).toEqual([])
  })

  it('has no duplicate names', () => {
    expect(new Set(names).size).toBe(names.length)
  })

  // Lucide aliases are extra names for the same component, so count components
  it('matches the source SVG counts', () => {
    const components = (suffix: string) =>
      new Set(Object.entries(icons).filter(([n]) => n.endsWith(suffix)).map(([, c]) => c))
    expect(components('Filled').size).toBe(countSvgs('filled'))
    expect(components('Duotone').size).toBe(countSvgs('duotone'))
  })

  it('exports Lucide aliases as the renamed icon', () => {
    expect(icons.AlertCircleFilled).toBe(icons.CircleAlertFilled)
  })
})
