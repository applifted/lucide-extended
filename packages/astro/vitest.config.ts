import { getViteConfig } from 'astro/config'

// getViteConfig adds Astro's compiler, so tests can render the .astro component
export default getViteConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
}, { logLevel: 'error' })
