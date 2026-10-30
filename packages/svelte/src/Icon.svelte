<script lang="ts">
  import { DEFAULT_SECONDARY_OPACITY } from './constants.js'
  import type { DuotoneIconProps, IconNode, IconNodeKind } from './types.js'

  // Every icon component renders this one, passing its slug and nodes.
  let {
    slug,
    nodes,
    size = 24,
    color = 'currentColor',
    secondaryColor,
    secondaryOpacity = DEFAULT_SECONDARY_OPACITY,
    strokeWidth: _strokeWidth,
    absoluteStrokeWidth: _absoluteStrokeWidth,
    class: className,
    children,
    ...rest
  }: DuotoneIconProps & { slug: string; nodes: IconNode[] } = $props()

  const labelled = $derived(rest['aria-label'] != null || rest['aria-labelledby'] != null)

  const paint = (kind: IconNodeKind) => {
    if (kind === 'stroke') {
      return { fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } as const
    }
    if (kind === 'tint') return { fill: secondaryColor ?? color, opacity: secondaryOpacity }
    return { fill: color }
  }
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  class={['applifted-icon', `applifted-icon-${slug}`, className]}
  aria-hidden={labelled ? undefined : 'true'}
  {...rest}
>
  {#each nodes as [, attrs, kind]}
    <path {...attrs} {...paint(kind)} />
  {/each}
  {@render children?.()}
</svg>
