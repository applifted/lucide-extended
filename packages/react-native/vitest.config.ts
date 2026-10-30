import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // react-native-svg needs a React Native runtime; the tests read the element tree instead
  resolve: { alias: { 'react-native-svg': path.resolve(import.meta.dirname, 'test/react-native-svg.ts') } },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    typecheck: { enabled: true, include: ['test/**/*.test-d.ts'] },
  },
})
