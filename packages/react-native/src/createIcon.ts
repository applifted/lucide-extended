import { createElement, forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react'
import { Path, Svg, type SvgProps } from 'react-native-svg'
import { DEFAULT_SECONDARY_OPACITY } from './constants.js'

export type IconNodeKind = 'stroke' | 'tint' | 'fill'
export type IconNode = [tag: 'path', attrs: Record<string, string>, kind: IconNodeKind]

export interface IconProps extends Omit<SvgProps, 'color' | 'strokeWidth'> {
  size?: string | number
  /** Defaults to black: react-native-svg has no inherited colour to fall back on. */
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

export type Icon = ForwardRefExoticComponent<IconProps & RefAttributes<Svg>>
export type DuotoneIcon = ForwardRefExoticComponent<DuotoneIconProps & RefAttributes<Svg>>

// Screen readers skip the icon unless it's labelled: React Native's equivalent of
// aria-hidden, on iOS (accessibilityElementsHidden) and Android (importantForAccessibility).
const HIDDEN = { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } as const
const LABELLED = { accessible: true, accessibilityRole: 'image' } as const

function createIcon(displayName: string, nodes: IconNode[]): DuotoneIcon {
  const Component = forwardRef<Svg, DuotoneIconProps>(
    (
      {
        size = 24,
        color = 'black',
        secondaryColor,
        secondaryOpacity = DEFAULT_SECONDARY_OPACITY,
        strokeWidth: _strokeWidth,
        absoluteStrokeWidth: _absoluteStrokeWidth,
        children,
        ...rest
      },
      ref,
    ) => {
      const labelled =
        rest.accessibilityLabel != null || rest['aria-label'] != null || rest.accessibilityLabelledBy != null || rest['aria-labelledby'] != null

      const paint = (kind: IconNodeKind) => {
        if (kind === 'stroke') {
          return { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
        }
        if (kind === 'tint') return { fill: secondaryColor ?? color, opacity: secondaryOpacity }
        return { fill: color }
      }

      return createElement(
        Svg,
        { ref, width: size, height: size, viewBox: '0 0 24 24', fill: 'none', ...(labelled ? LABELLED : HIDDEN), ...rest },
        ...nodes.map(([, attrs, kind], i) => createElement(Path, { key: i, ...attrs, ...paint(kind) })),
        children,
      )
    },
  )

  Component.displayName = displayName
  return Component
}

/** Filled icons take no secondary colour or opacity props. */
export const createFilledIcon = createIcon as (displayName: string, nodes: IconNode[]) => Icon

export const createDuotoneIcon = createIcon
