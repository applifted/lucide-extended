// Helpers for each package's tree-shaking test: bundle a one-icon entry through
// the package's real exports map, then look for other icons' path data.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync } from 'node:fs'
import path from 'node:path'
import { build } from 'vite'
import { collectPaths, readTree, ROOT } from '../../scripts/lib.ts'

/** The path data of a source icon, as it appears in every package's output. */
export async function pathData(slug: string): Promise<string[]> {
  const [, name, variant] = slug.match(/^(.+)-(filled|duotone)$/)!
  const tree = await readTree(path.join(ROOT, 'svg', variant, `${name}.svg`))
  return collectPaths(tree).map((p) => p.attributes.d)
}

/**
 * Bundles `<packageDir>/test/fixtures/tree-shaking/entry.js`, minified, with the
 * package linked into the fixture so Vite resolves it as a consumer would,
 * through the exports map and "sideEffects": false.
 */
export async function bundleFixture(packageDir: string, external: string[] = []): Promise<string> {
  if (!existsSync(path.join(packageDir, 'dist/index.js'))) {
    throw new Error('dist/ is missing — run `npm run build` before the tree-shaking test')
  }
  const { name } = JSON.parse(readFileSync(path.join(packageDir, 'package.json'), 'utf8')) as { name: string }
  const fixture = path.join(packageDir, 'test/fixtures/tree-shaking')
  const outDir = path.join(fixture, 'out')

  const modules = path.join(fixture, 'node_modules')
  rmSync(modules, { recursive: true, force: true })
  mkdirSync(modules, { recursive: true })
  symlinkSync(packageDir, path.join(modules, name), 'dir')

  rmSync(outDir, { recursive: true, force: true })
  await build({
    root: fixture,
    configFile: false,
    logLevel: 'silent',
    build: {
      outDir,
      minify: true,
      lib: { entry: path.join(fixture, 'entry.js'), formats: ['es'], fileName: 'bundle' },
      rollupOptions: { external },
    },
  })

  return readdirSync(outDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(path.join(outDir, f), 'utf8'))
    .join('\n')
}
