import { defineConfig } from 'vitest/config'

// Repo-level tests (icons.json). Each package under packages/ has its own config.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
})
