// Checked by svelte-check (npm run check:types), which understands .svelte imports.
import type { ComponentProps } from 'svelte'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

type Filled = ComponentProps<typeof HeartFilled>
type Duotone = ComponentProps<typeof EighthNotesDuotone>

// @ts-expect-error filled icons have no secondary colour
export const filledColor: Filled = { secondaryColor: 'blue' }
// @ts-expect-error filled icons have no secondary opacity
export const filledOpacity: Filled = { secondaryOpacity: 0.4 }
export const duotone: Duotone = { secondaryColor: 'blue', secondaryOpacity: 0.4 }

export const lucideShaped: Filled = { size: 32, color: 'red', strokeWidth: 3, absoluteStrokeWidth: true, class: 'x', 'aria-label': 'Liked' }
// @ts-expect-error size is a number or string
export const badSize: Filled = { size: true }
