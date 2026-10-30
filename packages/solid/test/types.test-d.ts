import { createComponent } from 'solid-js'
import { it } from 'vitest'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

it('rejects secondary props on filled icons', () => {
  // @ts-expect-error filled icons have no secondary colour
  createComponent(HeartFilled, { secondaryColor: 'blue' })
  // @ts-expect-error filled icons have no secondary opacity
  createComponent(HeartFilled, { secondaryOpacity: 0.4 })
  createComponent(EighthNotesDuotone, { secondaryColor: 'blue', secondaryOpacity: 0.4 })
})

it('accepts Lucide-shaped props and a ref', () => {
  createComponent(HeartFilled, { size: 32, color: 'red', strokeWidth: 3, absoluteStrokeWidth: true, class: 'x', 'aria-label': 'Liked', ref: (el: SVGSVGElement) => el })
  // @ts-expect-error size is a number or string
  createComponent(HeartFilled, { size: true })
})
