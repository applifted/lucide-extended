import { createComponent, render, renderComponent, renderSlot } from 'astro/compiler-runtime'
import IconComponent from './Icon.astro'
import type { DuotoneIcon, Icon, IconNode } from './types'

// Each icon is an Astro component rendering Icon.astro with its nodes, as in
// @lucide/astro. The package ships this source; the site's Astro build compiles it.
function createIcon(slug: string, nodes: IconNode[]): DuotoneIcon {
  const component = createComponent(
    (result: any, props: Record<string, unknown>, slots: Record<string, any>) =>
      render`${renderComponent(result, 'Icon', IconComponent, { ...props, slug, nodes }, {
        default: () => render`${renderSlot(result, slots['default'])}`,
      })}`,
    undefined,
    'none',
  )
  return component as unknown as DuotoneIcon
}

/** Filled icons take no secondary colour or opacity props. */
export const createFilledIcon = createIcon as (slug: string, nodes: IconNode[]) => Icon

export const createDuotoneIcon = createIcon
