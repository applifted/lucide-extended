import {
  createElement,
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type SVGAttributes,
} from 'react'

const DEFAULT_SECONDARY_OPACITY = 0.15 // keep in sync with scripts/constants.ts

export type IconNodeKind = 'stroke' | 'tint' | 'fill'
export type IconNode = [tag: 'path', attrs: Record<string, string>, kind: IconNodeKind]

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  size?: string | number
  color?: string
  /** Accepted for Lucide-shaped props; ignored. */
  strokeWidth?: string | number
  /** Accepted for Lucide-shaped props; ignored. */
  absoluteStrokeWidth?: boolean
}

export interface DuotoneIconProps extends IconProps {
  secondaryColor?: string
  secondaryOpacity?: string | number
}

export type Icon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
export type DuotoneIcon = ForwardRefExoticComponent<DuotoneIconProps & RefAttributes<SVGSVGElement>>

function createIcon(displayName: string, slug: string, nodes: IconNode[]): DuotoneIcon {
  const Component = forwardRef<SVGSVGElement, DuotoneIconProps>(
    (
      {
        size = 24,
        color = 'currentColor',
        secondaryColor,
        secondaryOpacity = DEFAULT_SECONDARY_OPACITY,
        strokeWidth: _strokeWidth,
        absoluteStrokeWidth: _absoluteStrokeWidth,
        className,
        children,
        ...rest
      },
      ref,
    ) => {
      const labelled = rest['aria-label'] != null || rest['aria-labelledby'] != null

      const paint = (kind: IconNodeKind) => {
        if (kind === 'stroke') {
          return { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
        }
        if (kind === 'tint') return { fill: secondaryColor ?? color, opacity: secondaryOpacity }
        return { fill: color }
      }

      return createElement(
        'svg',
        {
          ref,
          xmlns: 'http://www.w3.org/2000/svg',
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          className: ['applifted-icon', `applifted-icon-${slug}`, className].filter(Boolean).join(' '),
          'aria-hidden': labelled ? undefined : true,
          ...rest,
        },
        ...nodes.map(([tag, attrs, kind], i) => createElement(tag, { key: i, ...attrs, ...paint(kind) })),
        children,
      )
    },
  )

  Component.displayName = displayName
  return Component
}

/** Filled icons take no secondary colour or opacity props. */
export const createFilledIcon = createIcon as (displayName: string, slug: string, nodes: IconNode[]) => Icon

export const createDuotoneIcon = createIcon
