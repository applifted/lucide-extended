import { svelte } from '@sveltejs/vite-plugin-svelte'
import { configDefaults, defineConfig } from 'vitest/config'

// Two projects, because Svelte compiles components for the browser or the server:
// DOM tests need the browser build, SSR tests the server one.
export default defineConfig({
  plugins: [svelte()],
  test: {
    projects: [
      {
        extends: true,
        resolve: { conditions: ['browser'] },
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['test/**/*.test.ts'],
          exclude: [...configDefaults.exclude, 'test/**/*.server.test.ts'],
        },
      },
      {
        extends: true,
        test: { name: 'server', environment: 'node', include: ['test/**/*.server.test.ts'] },
      },
    ],
  },
})
