import { mergeProps, splitProps, type Component, type JSX } from 'solid-js'
import { createComponent, Dynamic } from 'solid-js/web'
import { DEFAULT_SECONDARY_OPACITY } from './constants.js'

export type IconNodeKind = 'stroke' | 'tint' | 'fill'
export type IconNode = [tag: 'path', attrs: Record<string, string>, kind: IconNodeKind]

type SVGProps = Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'color' | 'stroke-width'>

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

export type Icon = Component<IconProps>
export type DuotoneIcon = Component<DuotoneIconProps>

const LOCAL = ['size', 'color', 'secondaryColor', 'secondaryOpacity', 'strokeWidth', 'absoluteStrokeWidth', 'class', 'children'] as const

// Built with Dynamic rather than JSX, so the package needs no Solid compiler and
// solid-js/web picks the browser or server build. Props are read through getters,
// never destructured, so the icon updates when they change.
function createIcon(slug: string, nodes: IconNode[]): DuotoneIcon {
  return (props) => {
    const [local, rest] = splitProps(props, LOCAL)
    const color = () => local.color ?? 'currentColor'

    const paint = (kind: IconNodeKind) => {
      if (kind === 'stroke') {
        return { fill: 'none', get stroke() { return color() }, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
      }
      if (kind === 'tint') {
        return {
          get fill() { return local.secondaryColor ?? color() },
          get opacity() { return local.secondaryOpacity ?? DEFAULT_SECONDARY_OPACITY },
        }
      }
      return { get fill() { return color() } }
    }

    return createComponent(
      Dynamic,
      mergeProps(
        {
          component: 'svg',
          xmlns: 'http://www.w3.org/2000/svg',
          get width() { return local.size ?? 24 },
          get height() { return local.size ?? 24 },
          viewBox: '0 0 24 24',
          fill: 'none',
          get class() { return ['applifted-icon', `applifted-icon-${slug}`, local.class].filter(Boolean).join(' ') },
          get 'aria-hidden'() { return rest['aria-label'] != null || rest['aria-labelledby'] != null ? undefined : 'true' },
        },
        rest,
        {
          get children() {
            return [
              ...nodes.map(([tag, attrs, kind]) => createComponent(Dynamic, mergeProps({ component: tag }, attrs, paint(kind)))),
              local.children,
            ]
          },
        },
      ),
    )
  }
}

/** Filled icons take no secondary colour or opacity props. */
export const createFilledIcon = createIcon as (slug: string, nodes: IconNode[]) => Icon

export const createDuotoneIcon = createIcon
