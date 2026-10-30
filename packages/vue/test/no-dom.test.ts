// @vitest-environment node
import { expect, it } from 'vitest'
import { HeartFilled } from '../src/index.js'

// Server rendering and build tools import icons without a DOM
it('imports without a DOM', () => {
  expect(typeof document).toBe('undefined')
  expect(HeartFilled).toBeTruthy()
})
