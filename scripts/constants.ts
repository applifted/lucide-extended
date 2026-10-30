import { writeFile } from 'node:fs/promises'
import path from 'node:path'

export const TINT_OPACITY = 0.15

/** Writes src/constants.ts, for packages whose runtime applies the default tint opacity. */
export async function writeConstants(src: string): Promise<void> {
  await writeFile(
    path.join(src, 'constants.ts'),
    `// Generated from scripts/constants.ts — do not edit\nexport const DEFAULT_SECONDARY_OPACITY = ${TINT_OPACITY}\n`,
  )
}
