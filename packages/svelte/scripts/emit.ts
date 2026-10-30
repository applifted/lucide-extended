// Writes src/icons/*.svelte, src/icons/*.ts and src/index.ts for lucide-extended-svelte.
// Each icon is a .svelte component rendering Icon.svelte with its nodes, plus a
// .ts module re-exporting it under the component name, as the other packages do.
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { writeConstants } from '../../../scripts/constants.ts'
import type { Emitter } from '../../../scripts/generate.ts'
import { toSvgAttrs } from '../../../scripts/lib.ts'
import { iconSource, writeIconModules } from '../../../scripts/modules.ts'

const PROPS = { filled: 'IconProps', duotone: 'DuotoneIconProps' } as const

export const emit: Emitter = async (icons, { src }) => {
  await writeConstants(src)
  for (const { variant, slug, nodes } of icons) {
    const data = JSON.stringify(nodes.map((n) => [n.tag, toSvgAttrs(n.attrs), n.kind]))
    await writeFile(
      path.join(src, 'icons', `${slug}.svelte`),
      `<script module lang="ts">
  import type { IconNode } from '../types.js'

  const nodes: IconNode[] = ${data}
</script>

<script lang="ts">
  import Icon from '../Icon.svelte'
  import type { ${PROPS[variant]} } from '../types.js'

  let props: ${PROPS[variant]} = $props()
</script>

<Icon {...props} slug="${slug}" {nodes} />
`,
    )
  }
  await writeIconModules(
    icons,
    src,
    ({ slug, component }) => iconSource(component, 'Component', { imports: `import Component from './${slug}.svelte'` }),
    ["export type { DuotoneIconProps, IconProps } from './types.js'"],
  )
}
