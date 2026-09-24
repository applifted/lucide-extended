import path from 'node:path'
import type { INode } from 'svgson'
import { TINT_OPACITY } from './constants.ts'
import { classify, collectPaths, listSources, readTree, type Variant } from './lib.ts'

type Failure = { type: string; file: string; detail?: string }

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const FORBIDDEN = new Set(['text', 'image', 'mask', 'clipPath', 'use', 'filter'])
const ALLOWED = new Set(['svg', 'path'])

const failures: Failure[] = []

function walk(node: INode, visit: (node: INode) => void) {
  visit(node)
  node.children.forEach((child) => walk(child, visit))
}

async function check(variant: Variant, name: string, file: string) {
  const rel = path.relative(process.cwd(), file)
  const fail = (type: string, detail?: string) => failures.push({ type, file: rel, detail })

  if (!KEBAB.test(name)) fail('filename is not kebab-case')

  const tree = await readTree(file)

  if (tree.attributes.viewBox !== '0 0 24 24') fail('viewBox is not "0 0 24 24"', tree.attributes.viewBox)

  walk(tree, (node) => {
    if (node.type !== 'element') return
    if (FORBIDDEN.has(node.name)) fail(`contains <${node.name}>`)
    else if (node.name === 'g') fail('contains a <g> wrapper')
    else if (!ALLOWED.has(node.name)) fail('contains an unsupported element', `<${node.name}>`)
    if ('transform' in node.attributes) fail('has a transform attribute', `on <${node.name}>`)
  })

  const paths = collectPaths(tree)
  if (paths.length === 0) {
    fail('has no <path>')
    return
  }

  const kinds = paths.map((p) => classify(p.attributes))

  if (variant === 'filled') {
    if (kinds.includes('stroke')) fail('filled: contains a stroke path')
    if (kinds.includes('tint')) fail('filled: contains a translucent (tint) path')
    return
  }

  if (!kinds.includes('stroke')) fail('duotone: no stroke path')
  if (!kinds.includes('tint')) fail('duotone: no tint path')
  if (kinds.includes('fill')) fail('duotone: contains a plain fill path')

  paths.forEach((p, i) => {
    if (kinds[i] === 'tint' && Number(p.attributes.opacity) !== TINT_OPACITY) {
      fail(`duotone: tint opacity is not ${TINT_OPACITY}`, p.attributes.opacity)
    }
    if (kinds[i] === 'stroke' && p.attributes['stroke-width'] !== '2') {
      fail('duotone: stroke-width is not 2', p.attributes['stroke-width'] ?? '(missing)')
    }
  })
}

const filled = await listSources('filled')
const duotone = await listSources('duotone')

for (const { name, file } of filled) await check('filled', name, file)
for (const { name, file } of duotone) await check('duotone', name, file)

console.log(`Checked ${filled.length} filled and ${duotone.length} duotone icons.`)

// Informational only: icons present in one set but not the other
const filledNames = new Set(filled.map((s) => s.name))
const duotoneNames = new Set(duotone.map((s) => s.name))
const onlyFilled = [...filledNames].filter((n) => !duotoneNames.has(n))
const onlyDuotone = [...duotoneNames].filter((n) => !filledNames.has(n))
console.log(`\nIn filled only: ${onlyFilled.length}`)
if (onlyFilled.length) console.log(`  ${onlyFilled.join(', ')}`)
console.log(`In duotone only: ${onlyDuotone.length}`)
if (onlyDuotone.length) console.log(`  ${onlyDuotone.join(', ')}`)

if (failures.length === 0) {
  console.log('\nValidation passed.')
  process.exit(0)
}

// Group by failure type, deduplicating repeated failures within one file
const groups = new Map<string, Map<string, Set<string>>>()
for (const { type, file, detail } of failures) {
  const byFile = groups.get(type) ?? new Map<string, Set<string>>()
  const details = byFile.get(file) ?? new Set<string>()
  if (detail) details.add(detail)
  byFile.set(file, details)
  groups.set(type, byFile)
}

const failedFiles = new Set(failures.map((f) => f.file))
console.error(`\nValidation failed: ${failedFiles.size} file(s)\n`)
for (const [type, byFile] of groups) {
  console.error(`${type} — ${byFile.size} file(s)`)
  for (const [file, details] of byFile) {
    console.error(`  ${file}${details.size ? ` (${[...details].join(', ')})` : ''}`)
  }
  console.error('')
}
process.exit(1)
