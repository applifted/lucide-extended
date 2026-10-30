import { render } from 'svelte/server'
import { expect, it } from 'vitest'
import { EighthNotesDuotone, HeartFilled } from '../src/index.js'

// Svelte marks its blocks with comments in server output
const markup = (body: string) => body.replace(/<!--.*?-->/g, '')

it('renders on the server, without a DOM', () => {
  expect(typeof document).toBe('undefined')
  expect(markup(render(HeartFilled, { props: { class: 'extra' } }).body)).toMatch(
    /^<svg [^>]*class="applifted-icon applifted-icon-heart-filled extra" aria-hidden="true"[^>]*><path d="[^"]+" fill="currentColor"><\/path><\/svg>$/,
  )
  const duotone = markup(render(EighthNotesDuotone, { props: { color: 'red', secondaryOpacity: 0.4, 'aria-label': 'Music' } }).body)
  expect(duotone).toContain('aria-label="Music"')
  expect(duotone).not.toContain('aria-hidden')
  expect(duotone).toContain('fill="red" opacity="0.4"')
  expect(duotone).toContain('stroke="red" stroke-width="2"')
})
