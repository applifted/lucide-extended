// Every icon, parsed once, in the shape each package's emitter consumes.
import { lucideIcon } from './catalogue.ts'
import { collectPaths, listSources, readTree, toNodes, toPascal, VARIANTS, type IconNode, type Variant } from './lib.ts'
import type { INode } from 'svgson'

export type IconName = {
  /** File slug and deep-import path: `circle-check-filled` */
  slug: string
  /** Export name: `CircleCheckFilled` */
  component: string
}

export type SourceIcon = IconName & {
  /** Lucide name, kebab-case: `circle-check` */
  name: string
  variant: Variant
  nodes: IconNode[]
  /** Lucide's old names for this icon, exported as deprecated re-exports: `alert-circle-filled` */
  aliases: IconName[]
  /** Why Lucide deprecated this icon, if it did: its modules get a @deprecated JSDoc */
  deprecated?: string
}

export const SUFFIX: Record<Variant, string> = { filled: 'Filled', duotone: 'Duotone' }

export function iconName(name: string, variant: Variant): IconName {
  return { slug: `${name}-${variant}`, component: `${toPascal(name)}${SUFFIX[variant]}` }
}

/** One icon from its parsed source SVG, Lucide alias names and deprecation reason. */
export function toIcon(name: string, variant: Variant, tree: INode, aliases: string[] = [], deprecated?: string): SourceIcon {
  // Tint first so backing shapes sit behind outlines. Sort is stable, so
  // same-kind paths keep Figma's order.
  const nodes = toNodes(collectPaths(tree)).sort((a, b) => (a.kind === 'tint' ? 0 : 1) - (b.kind === 'tint' ? 0 : 1))
  return {
    name,
    variant,
    ...iconName(name, variant),
    nodes,
    aliases: aliases.map((alias) => iconName(alias, variant)),
    ...(deprecated && { deprecated }),
  }
}

/** All icons, sorted by component name. Throws if an alias clashes with an icon name. */
export async function loadIcons(): Promise<SourceIcon[]> {
  const icons: SourceIcon[] = []
  for (const variant of VARIANTS) {
    for (const { name, file } of await listSources(variant)) {
      const { aliases, deprecated } = await lucideIcon(name)
      icons.push(toIcon(name, variant, await readTree(file), aliases, deprecated))
    }
  }

  const canonical = new Set(icons.map((i) => i.slug))
  const clash = icons.flatMap((i) => i.aliases).filter((a) => canonical.has(a.slug)).map((a) => a.slug)
  if (clash.length) throw new Error(`Lucide aliases clash with icon names: ${clash.join(', ')}`)

  return icons.sort((a, b) => a.component.localeCompare(b.component))
}
