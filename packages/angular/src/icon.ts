import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { DEFAULT_SECONDARY_OPACITY } from './constants.js'

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

/**
 * Renders an icon into the `<svg>` it's placed on: `<svg [lxIcon]="HeartFilled"></svg>`.
 * `class`, `style`, events and other attributes stay on that `<svg>`. Secondary
 * inputs only affect duotone icons; one component can't reject them by type.
 */
@Component({
  selector: 'svg[lxIcon]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    '[attr.width]': 'size()',
    '[attr.height]': 'size()',
    '[attr.class]': 'classes()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-hidden]': 'ariaLabel() != null || ariaLabelledby() != null ? null : "true"',
  },
  template: `
    @for (node of lxIcon().nodes; track $index) {
      @switch (node[2]) {
        @case ('stroke') {
          <svg:path [attr.d]="node[1]['d']" [attr.fill-rule]="node[1]['fill-rule']" [attr.clip-rule]="node[1]['clip-rule']"
            fill="none" [attr.stroke]="color()" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('tint') {
          <svg:path [attr.d]="node[1]['d']" [attr.fill-rule]="node[1]['fill-rule']" [attr.clip-rule]="node[1]['clip-rule']"
            [attr.fill]="secondaryColor() ?? color()" [attr.opacity]="secondaryOpacity()" />
        }
        @default {
          <svg:path [attr.d]="node[1]['d']" [attr.fill-rule]="node[1]['fill-rule']" [attr.clip-rule]="node[1]['clip-rule']"
            [attr.fill]="color()" />
        }
      }
    }
    <ng-content />
  `,
})
export class LxIcon {
  readonly lxIcon = input.required<Icon>()
  readonly size = input<string | number>(24)
  readonly color = input<string>('currentColor')
  /** Duotone icons only: colour of the backing shape. Defaults to `color`. */
  readonly secondaryColor = input<string>()
  /** Duotone icons only: opacity of the backing shape. */
  readonly secondaryOpacity = input<string | number>(DEFAULT_SECONDARY_OPACITY)
  /** Accepted for Lucide-shaped inputs; ignored. */
  readonly strokeWidth = input<string | number>()
  /** Accepted for Lucide-shaped inputs; ignored. */
  readonly absoluteStrokeWidth = input<boolean>()
  /** Added after the `applifted-icon` classes. */
  readonly class = input<string>()
  // Inputs, so the icon knows it's labelled and drops aria-hidden
  readonly ariaLabel = input<string | null | undefined>(undefined, { alias: 'aria-label' })
  readonly ariaLabelledby = input<string | null | undefined>(undefined, { alias: 'aria-labelledby' })

  protected readonly classes = computed(() =>
    ['applifted-icon', `applifted-icon-${this.lxIcon().slug}`, this.class()].filter(Boolean).join(' '),
  )
}
