// @vitest-environment node
import path from 'node:path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { beforeAll, describe, expect, it } from 'vitest'
import { bundleFixture, pathData } from '../../../test/support/tree-shaking.ts'

let bundle = ''

beforeAll(async () => {
  bundle = await bundleFixture(path.resolve(import.meta.dirname, '..'), [/^svelte(\/|$)/], [svelte()])
}, 60_000)

describe('tree-shaking', () => {
  it('includes the imported icon', async () => {
    for (const d of await pathData('heart-filled')) expect(bundle).toContain(d)
  })

  it('excludes icons that were not imported', async () => {
    for (const slug of ['circle-check-duotone', 'heart-duotone']) {
      for (const d of await pathData(slug)) expect(bundle).not.toContain(d)
    }
    expect(bundle).not.toContain('CircleCheckDuotone')
  })

  it('is under 5 KB', () => {
    expect(Buffer.byteLength(bundle)).toBeLessThan(5 * 1024)
  })
})
