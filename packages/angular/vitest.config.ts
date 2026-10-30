import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
    exclude: [...configDefaults.exclude],
    setupFiles: ['test/setup.ts'],
  },
})
