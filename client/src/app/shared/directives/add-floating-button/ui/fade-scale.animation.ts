import { animate, state, style, transition, trigger } from '@angular/animations';

export const FadeScale = trigger('fadeScale', [
  state('hidden', style({ opacity: 0, transform: 'scale(0.1)' })),
  state('visible', style({ opacity: 1, transform: 'scale(1)' })),
  transition('hidden <=> visible', [animate('500ms ease-in')]),
]);
