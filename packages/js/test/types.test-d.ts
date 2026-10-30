import { expectTypeOf, it } from 'vitest'
import { createElement, EighthNotesDuotone, HeartFilled, type Icon } from '../src/index.js'

it('rejects secondary options on filled icons', () => {
  // @ts-expect-error filled icons have no secondary colour
  createElement(HeartFilled, { secondaryColor: 'blue' })
  // @ts-expect-error filled icons have no secondary opacity
  createElement(HeartFilled, { secondaryOpacity: 0.4 })
  createElement(EighthNotesDuotone, { secondaryColor: 'blue', secondaryOpacity: 0.4 })
})

it('accepts Lucide-shaped and plain attribute options', () => {
  createElement(HeartFilled, { size: 32, color: 'red', strokeWidth: 3, absoluteStrokeWidth: true, class: 'x', 'aria-label': 'Liked' })
  const icon: Icon = HeartFilled
  createElement(icon, { size: 16 })
  // @ts-expect-error an icon that may be filled takes no secondary colour
  createElement(icon, { secondaryColor: 'blue' })
  expectTypeOf(createElement(HeartFilled)).toEqualTypeOf<SVGSVGElement>()
})
