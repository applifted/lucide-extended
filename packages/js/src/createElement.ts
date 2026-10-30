import { DEFAULT_SECONDARY_OPACITY } from './constants.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

export type IconNodeKind = 'stroke' | 'tint' | 'fill'
export type IconNode = [tag: 'path', attrs: Record<string, string>, kind: IconNodeKind]

export interface Icon<Variant extends 'filled' | 'duotone' = 'filled' | 'duotone'> {
  /** Class name suffix and deep-import path: `heart-filled` */
  readonly slug: string
  readonly variant: Variant
  readonly nodes: readonly IconNode[]
}

export type FilledIcon = Icon<'filled'>
export type DuotoneIcon = Icon<'duotone'>

type AttributeValue = string | number | boolean | null | undefined

export interface BaseIconOptions {
  size?: string | number
  color?: string
  /** Accepted for Lucide-shaped options; ignored. */
  strokeWidth?: string | number
  /** Accepted for Lucide-shaped options; ignored. */
  absoluteStrokeWidth?: boolean
  /** Added after the `applifted-icon` classes. */
  class?: string
  /** Any other attribute is set on the `<svg>` as given, e.g. `'aria-label'`. */
  [attribute: string]: AttributeValue
}

export interface IconOptions extends BaseIconOptions {
  /** Filled icons have no secondary colour. */
  secondaryColor?: never
  /** Filled icons have no secondary opacity. */
  secondaryOpacity?: never
}

export interface DuotoneIconOptions extends BaseIconOptions {
  secondaryColor?: string
  secondaryOpacity?: string | number
}

function svgElement(tag: string, attrs: Record<string, AttributeValue>): SVGElement {
  const element = document.createElementNS(SVG_NS, tag)
  for (const [name, value] of Object.entries(attrs)) {
    if (value != null && value !== false) element.setAttribute(name, String(value))
  }
  return element
}

/**
 * Builds the icon as an `<svg>` element. Secondary options need a known duotone
 * icon: an `Icon` of either variant takes the filled options.
 */
export function createElement(icon: FilledIcon, options?: IconOptions): SVGSVGElement
export function createElement(icon: DuotoneIcon, options?: DuotoneIconOptions): SVGSVGElement
export function createElement(icon: Icon, options?: IconOptions): SVGSVGElement
export function createElement(icon: Icon, options?: DuotoneIconOptions): SVGSVGElement {
  return render(icon, options)
}

function render(icon: Icon, options: DuotoneIconOptions = {}): SVGSVGElement {
  const {
    size = 24,
    color = 'currentColor',
    secondaryColor,
    secondaryOpacity = DEFAULT_SECONDARY_OPACITY,
    strokeWidth: _strokeWidth,
    absoluteStrokeWidth: _absoluteStrokeWidth,
    class: className,
    ...rest
  } = options
  const labelled = rest['aria-label'] != null || rest['aria-labelledby'] != null

  const paint = (kind: IconNodeKind) => {
    if (kind === 'stroke') {
      return { fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
    }
    if (kind === 'tint') return { fill: secondaryColor ?? color, opacity: secondaryOpacity }
    return { fill: color }
  }

  const svg = svgElement('svg', {
    xmlns: SVG_NS,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    class: ['applifted-icon', `applifted-icon-${icon.slug}`, className].filter(Boolean).join(' '),
    'aria-hidden': labelled ? undefined : 'true',
    ...rest,
  }) as SVGSVGElement
  for (const [tag, attrs, kind] of icon.nodes) svg.append(svgElement(tag, { ...attrs, ...paint(kind) }))
  return svg
}

export interface CreateIconsOptions {
  /** The icons to use, by export name: `{ HeartFilled, StarDuotone }`. Only these are bundled. */
  icons: Record<string, Icon>
  /** Options applied to every icon. Attributes on the placeholder element win. */
  attrs?: DuotoneIconOptions
  /** The attribute naming the icon. Default `data-lucide-extended`. */
  nameAttr?: string
  /** Where to look for placeholders. Default `document`. */
  root?: ParentNode
}

const toPascal = (kebab: string) =>
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

/** Replaces every `<i data-lucide-extended="heart-filled">` placeholder with its icon. */
export function createIcons({ icons, attrs = {}, nameAttr = 'data-lucide-extended', root = document }: CreateIconsOptions): void {
  for (const placeholder of root.querySelectorAll(`[${nameAttr}]`)) {
    const name = placeholder.getAttribute(nameAttr)!
    const icon = icons[toPascal(name)]
    if (!icon) {
      console.warn(`lucide-extended-js: "${name}" was not passed to createIcons({ icons }).`)
      continue
    }

    const own = Object.fromEntries([...placeholder.attributes].map((a) => [a.name, a.value]))
    const className = [attrs.class, own.class].filter(Boolean).join(' ')
    placeholder.replaceWith(render(icon, { ...attrs, ...own, class: className || undefined }))
  }
}
