// @vitest-environment node
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync } from 'node:fs'
import path from 'node:path'
import { build } from 'vite'
import { beforeAll, describe, expect, it } from 'vitest'

const root = path.resolve(import.meta.dirname, '..')
const fixture = path.join(root, 'test/fixtures/tree-shaking')
const outDir = path.join(fixture, 'out')

// Read an icon's path data from the built output, as it will appear in the bundle
function firstD(slug: string): string {
  const source = readFileSync(path.join(root, 'dist/icons', `${slug}.js`), 'utf8')
  const match = source.match(/"d":\s*"([^"]+)"/)
  if (!match) throw new Error(`No path data found in dist/icons/${slug}.js`)
  return match[1]
}

let bundle = ''

beforeAll(async () => {
  if (!existsSync(path.join(root, 'dist/index.js'))) {
    throw new Error('dist/ is missing — run `npm run build` before the tree-shaking test')
  }

  // Link the package into the fixture so Vite resolves it through the real
  // exports map and "sideEffects": false, as a consumer would
  const scope = path.join(fixture, 'node_modules/@applifted')
  rmSync(path.join(fixture, 'node_modules'), { recursive: true, force: true })
  mkdirSync(scope, { recursive: true })
  symlinkSync(root, path.join(scope, 'icons-react'), 'dir')

  rmSync(outDir, { recursive: true, force: true })
  await build({
    root: fixture,
    configFile: false,
    logLevel: 'silent',
    build: {
      outDir,
      minify: true,
      lib: { entry: path.join(fixture, 'entry.js'), formats: ['es'], fileName: 'bundle' },
      rollupOptions: { external: ['react', 'react/jsx-runtime'] },
    },
  })

  bundle = readdirSync(outDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(path.join(outDir, f), 'utf8'))
    .join('\n')
}, 60_000)

describe('tree-shaking', () => {
  it('includes the imported icon', () => {
    expect(bundle).toContain(firstD('heart-filled'))
  })

  it('excludes icons that were not imported', () => {
    expect(bundle).not.toContain(firstD('circle-check-duotone'))
    expect(bundle).not.toContain(firstD('heart-duotone'))
    expect(bundle).not.toContain('CircleCheckDuotone')
  })

  it('is under 5 KB', () => {
    expect(Buffer.byteLength(bundle)).toBeLessThan(5 * 1024)
  })
})
