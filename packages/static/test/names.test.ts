import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import * as icons from '../src/index.js'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const countSvgs = (variant: string) =>
  readdirSync(path.join(repoRoot, 'svg', variant)).filter((f) => f.endsWith('.svg')).length

describe('exports', () => {
  it('every export ends in Filled or Duotone', () => {
    expect(Object.keys(icons).filter((n) => !/^[A-Z][A-Za-z0-9]*(Filled|Duotone)$/.test(n))).toEqual([])
  })

  // Lucide aliases are extra names for the same SVG string, so count strings
  it('matches the source SVG counts', () => {
    const unique = (suffix: string) => new Set(Object.entries(icons).filter(([n]) => n.endsWith(suffix)).map(([, svg]) => svg))
    expect(unique('Filled').size).toBe(countSvgs('filled'))
    expect(unique('Duotone').size).toBe(countSvgs('duotone'))
  })
})
