import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parseSync, type INode } from 'svgson'
import { describe, expect, it } from 'vitest'
import { toPascal } from '../../../scripts/lib.ts'
import * as icons from '../src/index.js'

const root = path.resolve(import.meta.dirname, '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')
const svgFiles = readdirSync(path.join(root, 'icons'))
const sprite = parseSync(read('sprite.svg'))
const unique = new Set(Object.values(icons))

describe('icons/*.svg', () => {
  it('has one file per export, aliases included', () => {
    expect(svgFiles).toHaveLength(Object.keys(icons).length)
  })

  it('matches the string export of the same name', () => {
    const exports: Record<string, string> = icons
    for (const file of svgFiles) {
      const name = toPascal(file.replace(/\.svg$/, ''))
      expect(exports[name], name).toBe(read(`icons/${file}`))
    }
  })

  it('renders duotone tints first, in currentColor at opacity 0.15', () => {
    const paths = parseSync(icons.EighthNotesDuotone).children
    const tints = paths.filter((p) => p.attributes.opacity)
    expect(tints.length).toBeGreaterThan(0)
    expect(paths.slice(0, tints.length)).toEqual(tints)
    for (const tint of tints) expect(tint.attributes).toMatchObject({ fill: 'currentColor', opacity: '0.15' })
    for (const stroke of paths.slice(tints.length)) {
      expect(stroke.attributes).toMatchObject({ fill: 'none', stroke: 'currentColor', 'stroke-width': '2' })
    }
  })

  it('carries the shared classes and is aria-hidden', () => {
    expect(parseSync(icons.HeartFilled).attributes).toMatchObject({
      class: 'applifted-icon applifted-icon-heart-filled',
      'aria-hidden': 'true',
      viewBox: '0 0 24 24',
    })
  })

  it('gives an alias the renamed icon', () => {
    expect(icons.AlertCircleFilled).toBe(icons.CircleAlertFilled)
    expect(read('icons/alert-circle-filled.svg')).toBe(read('icons/circle-alert-filled.svg'))
  })
})

describe('sprite.svg', () => {
  const symbols = sprite.children as INode[]

  it('has one symbol per icon, without aliases', () => {
    expect(symbols.every((s) => s.name === 'symbol')).toBe(true)
    expect(symbols).toHaveLength(unique.size)
    expect(new Set(symbols.map((s) => s.attributes.id)).size).toBe(symbols.length)
  })

  it('holds the same paths as the icon file', () => {
    const symbol = symbols.find((s) => s.attributes.id === 'eighth-notes-duotone')!
    expect(symbol.attributes.viewBox).toBe('0 0 24 24')
    expect(symbol.children).toEqual(parseSync(icons.EighthNotesDuotone).children)
  })
})

describe('exports map', () => {
  // Resolve as a consumer would, through the package's own name
  const resolve = (specifier: string) =>
    execFileSync(process.execPath, ['--input-type=module', '-e', `console.log(import.meta.resolve(${JSON.stringify(specifier)}))`], {
      cwd: root,
      encoding: 'utf8',
    }).trim()

  it('serves SVG files, the sprite and per-icon modules', () => {
    expect(resolve('lucide-extended-static/icons/heart-filled.svg')).toMatch(/\/icons\/heart-filled\.svg$/)
    expect(resolve('lucide-extended-static/sprite.svg')).toMatch(/\/sprite\.svg$/)
    expect(resolve('lucide-extended-static/heart-filled')).toMatch(/\/dist\/icons\/heart-filled\.js$/)
  })
})
