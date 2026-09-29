import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = path.resolve(import.meta.dirname, '..')

type Variant = 'filled' | 'duotone'

type CatalogueIcon = {
  name: string
  label: string
  tags: string[]
  categories: string[]
  aliases: string[]
  useCases: string[]
  variants: Variant[]
  components: Partial<Record<Variant, string>>
}

const catalogue = JSON.parse(readFileSync(path.join(root, 'icons.json'), 'utf8')) as {
  lucideVersion: string
  icons: CatalogueIcon[]
}

const svgNames = (variant: Variant) =>
  new Set(
    readdirSync(path.join(root, 'svg', variant))
      .filter((file) => file.endsWith('.svg'))
      .map((file) => file.slice(0, -'.svg'.length)),
  )

const toPascal = (kebab: string) =>
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

describe('icons.json', () => {
  const byName = new Map(catalogue.icons.map((icon) => [icon.name, icon]))

  it('records the pinned Lucide version', () => {
    const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      devDependencies: { 'lucide-react': string }
    }
    expect(catalogue.lucideVersion).toBe(pkg.devDependencies['lucide-react'])
  })

  it('lists each source icon once, with the variants that exist', () => {
    const filled = svgNames('filled')
    const duotone = svgNames('duotone')
    const expected = [...new Set([...filled, ...duotone])].sort((a, b) => a.localeCompare(b))

    expect(catalogue.icons.map((icon) => icon.name)).toEqual(expected)
    for (const icon of catalogue.icons) {
      const variants: Variant[] = []
      if (filled.has(icon.name)) variants.push('filled')
      if (duotone.has(icon.name)) variants.push('duotone')
      expect(icon.variants).toEqual(variants)
    }
  })

  it('uses Lucide search metadata and exact component names', () => {
    const heart = byName.get('heart')
    expect(heart).toMatchObject({
      label: 'Heart',
      tags: ['like', 'love', 'emotion', 'suit', 'playing', 'cards'],
      categories: ['medical', 'social', 'multimedia', 'emoji', 'gaming', 'shapes'],
      aliases: [],
      components: { filled: 'HeartFilled', duotone: 'HeartDuotone' },
    })

    const circleCheck = byName.get('circle-check')
    expect(circleCheck?.label).toBe('Circle Check')
    expect(circleCheck?.aliases).toContain('check-circle-2')
    expect(circleCheck?.components.filled).toBe('CircleCheckFilled')
  })

  it('gives every icon searchable tags and a component for each variant', () => {
    const suffix: Record<Variant, string> = { filled: 'Filled', duotone: 'Duotone' }
    for (const icon of catalogue.icons) {
      expect(icon.tags.length).toBeGreaterThan(0)
      expect(icon.label).toBe(
        icon.name
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
      )
      expect(Object.keys(icon.components).sort()).toEqual([...icon.variants].sort())
      for (const variant of icon.variants) {
        expect(icon.components[variant]).toBe(`${toPascal(icon.name)}${suffix[variant]}`)
      }
    }
  })
})
