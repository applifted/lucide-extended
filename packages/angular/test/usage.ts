// Type-checked with strict templates by `ngc -p tsconfig.spec.json` (npm test): the
// documented usage must compile against the built package.
import { Component, signal } from '@angular/core'
import { EighthNotesDuotone, HeartFilled, LxIcon, type DuotoneIcon, type FilledIcon } from '../dist/index.js'
import HeartDuotone from '../dist/icons/heart-duotone.js'

export const filled: FilledIcon = HeartFilled
export const duotone: DuotoneIcon = HeartDuotone

@Component({
  selector: 'lx-usage',
  imports: [LxIcon],
  template: `
    <svg [lxIcon]="HeartFilled"></svg>
    <svg [lxIcon]="HeartDuotone" [size]="32" color="crimson" secondaryColor="pink" [secondaryOpacity]="0.4"></svg>
    <svg [lxIcon]="EighthNotesDuotone" size="2rem" [strokeWidth]="3" [absoluteStrokeWidth]="true" class="mine"></svg>
    <svg [lxIcon]="HeartFilled" aria-label="Liked" (click)="clicked.set(true)"><title>Liked</title></svg>
    <svg [lxIcon]="HeartFilled" [aria-label]="label()"></svg>
  `,
})
export class Usage {
  readonly HeartFilled = HeartFilled
  readonly HeartDuotone = HeartDuotone
  readonly EighthNotesDuotone = EighthNotesDuotone
  readonly clicked = signal(false)
  readonly label = signal<string | null>(null)
}
