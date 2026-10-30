import { h, type FunctionComponent, type SVGAttributes } from 'preact'
import { DEFAULT_SECONDARY_OPACITY } from './constants.js'

export type IconNodeKind = 'stroke' | 'tint' | 'fill'
export type IconNode = [tag: 'path', attrs: Record<string, string>, kind: IconNodeKind]

type SVGProps = Omit<SVGAttributes<SVGSVGElement>, 'size' | 'color' | 'strokeWidth' | 'stroke-width'>

export interface IconProps extends SVGProps {
  size?: string | number
  color?: string
  /** Accepted for Lucide-shaped props; ignored. */
  strokeWidth?: string | number
  /** Accepted for Lucide-shaped props; ignored. */
  absoluteStrokeWidth?: boolean
  /** Filled icons have no secondary colour. */
  secondaryColor?: never
  /** Filled icons have no secondary opacity. */
  secondaryOpacity?: never
}

export interface DuotoneIconProps extends Omit<IconProps, 'secondaryColor' | 'secondaryOpacity'> {
  secondaryColor?: string
  secondaryOpacity?: string | number
}

export type Icon = FunctionComponent<IconProps>
export type DuotoneIcon = FunctionComponent<DuotoneIconProps>

// Preact sets SVG attributes by the names given, so paint uses the SVG names
// (stroke-width), not React's camelCase.
function createIcon(displayName: string, slug: string, nodes: IconNode[]): DuotoneIcon {
  const Component: DuotoneIcon = ({
    size = 24,
    color = 'currentColor',
    secondaryColor,
    secondaryOpacity = DEFAULT_SECONDARY_OPACITY,
    strokeWidth: _strokeWidth,
    absoluteStrokeWidth: _absoluteStrokeWidth,
    class: classAttr,
    className,
    children,
    ...rest
  }) => {
    const labelled = rest['aria-label'] != null || rest['aria-labelledby'] != null

    const paint = (kind: IconNodeKind) => {
      if (kind === 'stroke') {
        return { fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
      }
      if (kind === 'tint') return { fill: secondaryColor ?? color, opacity: secondaryOpacity }
      return { fill: color }
    }

    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        class: ['applifted-icon', `applifted-icon-${slug}`, classAttr, className].filter(Boolean).join(' '),
        'aria-hidden': labelled ? undefined : 'true',
        ...rest,
      },
      ...nodes.map(([tag, attrs, kind]) => h(tag, { ...attrs, ...paint(kind) })),
      children,
    )
  }

  Component.displayName = displayName
  return Component
}

/** Filled icons take no secondary colour or opacity props. */
export const createFilledIcon = createIcon as (displayName: string, slug: string, nodes: IconNode[]) => Icon

export const createDuotoneIcon = createIcon
