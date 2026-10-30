import type { HTMLAttributes } from 'astro/types'

export type IconNodeKind = 'stroke' | 'tint' | 'fill'
export type IconNode = [tag: 'path', attrs: Record<string, string>, kind: IconNodeKind]

type SVGProps = Omit<HTMLAttributes<'svg'>, 'color' | 'stroke-width'>

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

// The call signature is what the Astro language server reads to check props in .astro files
export type Icon = (props: IconProps) => unknown
export type DuotoneIcon = (props: DuotoneIconProps) => unknown
