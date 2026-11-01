// One command for everything a release depends on:
// validate → generate twice (output must match) → build → test → package checks.
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { generate } from './generate.ts'
import { ROOT } from './lib.ts'

const run = (command: string) => execSync(command, { cwd: ROOT, stdio: 'inherit' })

/** One hash over every generated file, keyed by path. */
async function hashGenerated(): Promise<string> {
  const files = await fg(
    [
      'icons.json',
      'packages/*/src/{icons/**,index.ts,constants.ts}',
      'packages/*/{icons.json,LICENSE,NOTICE}',
      'packages/static/{icons/**,sprite.svg}',
    ],
    { cwd: ROOT },
  )
  const hash = createHash('sha256')
  for (const file of files.sort()) hash.update(file).update('\0').update(await readFile(path.join(ROOT, file))).update('\0')
  return hash.digest('hex')
}

run('npm run validate')
await generate()
const first = await hashGenerated()
await generate()
const second = await hashGenerated()
if (first !== second) throw new Error('Generation is not deterministic: two runs produced different files.')
console.log(`Generation is deterministic (${first.slice(0, 12)}).`)

run('npm run build --workspaces')
run('npm test')
run('npm run check:package')
