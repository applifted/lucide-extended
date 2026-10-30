import { createElement } from 'react'
import type { Svg } from 'react-native-svg'
import { it } from 'vitest'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

it('rejects secondary props on filled icons', () => {
  // @ts-expect-error filled icons have no secondary colour
  createElement(HeartFilled, { secondaryColor: 'blue' })
  // @ts-expect-error filled icons have no secondary opacity
  createElement(HeartFilled, { secondaryOpacity: 0.4 })
  createElement(EighthNotesDuotone, { secondaryColor: 'blue', secondaryOpacity: 0.4 })
})

it('accepts Lucide-shaped and React Native props', () => {
  createElement(HeartFilled, { size: 32, color: 'red', strokeWidth: 3, absoluteStrokeWidth: true, testID: 'x', accessibilityLabel: 'Liked', ref: null as unknown as { current: Svg | null } })
  // @ts-expect-error size is a number or string
  createElement(HeartFilled, { size: true })
  // @ts-expect-error React Native has no className
  createElement(HeartFilled, { className: 'x' })
})
