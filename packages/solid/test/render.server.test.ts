import { createComponent } from 'solid-js'
import { NoHydration, renderToString } from 'solid-js/web'
import { expect, it } from 'vitest'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

const ssr = (fn: () => unknown) => renderToString(() => createComponent(NoHydration, { get children() { return fn() as never } }))

it('renders on the server, without a DOM', () => {
  expect(typeof document).toBe('undefined')
  expect(ssr(() => createComponent(HeartFilled, { class: 'extra' }))).toMatch(
    /^<svg [^>]*class="applifted-icon applifted-icon-heart-filled extra ?" aria-hidden="true"\s*><path d="[^"]+" fill="currentColor"><\/path><\/svg>$/,
  )
  const duotone = ssr(() => createComponent(EighthNotesDuotone, { color: 'red', secondaryOpacity: 0.4, 'aria-label': 'Music' }))
  expect(duotone).toContain('aria-label="Music"')
  expect(duotone).not.toContain('aria-hidden')
  expect(duotone).toContain('fill="red" opacity="0.4"')
  expect(duotone).toContain('stroke="red" stroke-width="2"')
})
