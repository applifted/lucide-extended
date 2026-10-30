import { configDefaults, defineConfig } from 'vitest/config'

// Two projects, because solid-js/web picks its browser or server build by export
// condition: DOM tests need the browser build, SSR tests the server one.
export default defineConfig({
  test: {
    typecheck: { enabled: true, include: ['test/**/*.test-d.ts'] },
    projects: [
      {
        resolve: { conditions: ['development', 'browser'] },
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['test/**/*.test.ts'],
          exclude: [...configDefaults.exclude, 'test/**/*.server.test.ts'],
          server: { deps: { inline: [/solid-js/] } },
        },
      },
      {
        test: { name: 'server', environment: 'node', include: ['test/**/*.server.test.ts'] },
      },
    ],
  },
})
