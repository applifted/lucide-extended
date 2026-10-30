import { h } from 'preact'
import { it } from 'vitest'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

it('rejects secondary props on filled icons', () => {
  // @ts-expect-error filled icons have no secondary colour
  h(HeartFilled, { secondaryColor: 'blue' })
  // @ts-expect-error filled icons have no secondary opacity
  h(HeartFilled, { secondaryOpacity: 0.4 })
  h(EighthNotesDuotone, { secondaryColor: 'blue', secondaryOpacity: 0.4 })
})

it('accepts Lucide-shaped props and SVG attributes', () => {
  h(HeartFilled, { size: 32, color: 'red', strokeWidth: 3, absoluteStrokeWidth: true, class: 'x', 'aria-label': 'Liked', onClick: () => {} })
  // @ts-expect-error size is a number or string
  h(HeartFilled, { size: true })
})
