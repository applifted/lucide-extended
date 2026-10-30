import type { SVGAttributes } from 'svelte/elements'

export type IconNodeKind = 'stroke' | 'tint' | 'fill'
export type IconNode = [tag: 'path', attrs: Record<string, string>, kind: IconNodeKind]

type SVGProps = Omit<SVGAttributes<SVGSVGElement>, 'color' | 'stroke-width'>

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
