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

  it('matches the source SVG counts', () => {
    expect(names.filter((n) => n.endsWith('Filled'))).toHaveLength(countSvgs('filled'))
    expect(names.filter((n) => n.endsWith('Duotone'))).toHaveLength(countSvgs('duotone'))
  })
})
