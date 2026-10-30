// Prints an icon's server-rendered markup and Solid's hydration script, as JSON, for
// the hydration test. Runs in plain Node, so solid-js/web resolves to its server
// build, as on a real server.
import { createComponent } from 'solid-js'
import { generateHydrationScript, renderToString } from 'solid-js/web'
import { EighthNotesDuotone } from '../../../src/index.ts'

const html = renderToString(() => createComponent(EighthNotesDuotone, JSON.parse(process.argv[2]!)))
process.stdout.write(JSON.stringify({ html, script: generateHydrationScript() }))
