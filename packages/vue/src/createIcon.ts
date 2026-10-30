import { defineComponent, h, type DefineSetupFnComponent } from 'vue'
import { DEFAULT_SECONDARY_OPACITY } from './constants.js'

export type IconNodeKind = 'stroke' | 'tint' | 'fill'
export type IconNode = [tag: 'path', attrs: Record<string, string>, kind: IconNodeKind]

export interface IconProps {
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

export type Icon = DefineSetupFnComponent<IconProps>
export type DuotoneIcon = DefineSetupFnComponent<DuotoneIconProps>

// Declared, so Vue accepts both secondary-color and secondaryColor, and so filled
// icons don't pass secondary props through to the <svg>. Every other attribute
// (class, style, aria-label, listeners) falls through to the <svg>.
const PROPS: (keyof DuotoneIconProps)[] = ['size', 'color', 'strokeWidth', 'absoluteStrokeWidth', 'secondaryColor', 'secondaryOpacity']

function createIcon(name: string, slug: string, nodes: IconNode[]): DuotoneIcon {
  return defineComponent(
    (props: DuotoneIconProps, { attrs, slots }) =>
      () => {
        const { size = 24, color = 'currentColor', secondaryColor, secondaryOpacity = DEFAULT_SECONDARY_OPACITY } = props
        const labelled = attrs['aria-label'] != null || attrs['aria-labelledby'] != null

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
            class: ['applifted-icon', `applifted-icon-${slug}`],
            'aria-hidden': labelled ? undefined : 'true',
          },
          [...nodes.map(([tag, attrs, kind]) => h(tag, { ...attrs, ...paint(kind) })), slots.default?.()],
        )
      },
    { name, props: PROPS },
  )
}

/** Filled icons take no secondary colour or opacity props. */
export const createFilledIcon = createIcon as (name: string, slug: string, nodes: IconNode[]) => Icon

export const createDuotoneIcon = createIcon
