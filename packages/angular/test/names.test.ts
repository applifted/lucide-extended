import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import * as exported from '../dist/index.js'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const countSvgs = (variant: string) =>
  readdirSync(path.join(repoRoot, 'svg', variant)).filter((f) => f.endsWith('.svg')).length

const { LxIcon, ...icons } = exported
const names = Object.keys(icons)

describe('exports', () => {
  it('exports the LxIcon component', () => {
    expect(typeof LxIcon).toBe('function')
  })

  it('every icon export ends in Filled or Duotone', () => {
    expect(names.filter((n) => !/^[A-Z][A-Za-z0-9]*(Filled|Duotone)$/.test(n))).toEqual([])
  })

  // Lucide aliases are extra names for the same icon, so count icons
  it('matches the source SVG counts', () => {
    const unique = (suffix: string) => new Set(Object.entries(icons).filter(([n]) => n.endsWith(suffix)).map(([, i]) => i))
    expect(unique('Filled').size).toBe(countSvgs('filled'))
    expect(unique('Duotone').size).toBe(countSvgs('duotone'))
  })

  it('names each icon after its slug and variant', () => {
    for (const [name, icon] of Object.entries(icons)) expect(name.endsWith(icon.variant === 'filled' ? 'Filled' : 'Duotone')).toBe(true)
  })

  it('exports Lucide aliases as the renamed icon', () => {
    expect(icons.AlertCircleFilled).toBe(icons.CircleAlertFilled)
    expect(icons.MusicFilled).toBe(icons.EighthNotesFilled)
  })
})
