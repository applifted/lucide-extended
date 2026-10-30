import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'

// Repo-level tests (icons.json, parity). Each package under packages/ has its own config.
// The Svelte plugin compiles lucide-extended-svelte's components for test/parity.test.ts.
export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
})
