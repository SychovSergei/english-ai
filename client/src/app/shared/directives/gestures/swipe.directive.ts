import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface SwipeEvent {
  direction: SwipeDirection;
  distanceX: number;
  distanceY: number;
  duration: number;
  originalEvent: TouchEvent;
}

@Directive({
  selector: '[appSwipe]',
  standalone: true,
})
export class SwipeDirective {
  @Input() minDistance = 100;
  @Input() maxDuration = 1500;
  @Input() minDuration = 50;
  @Input() disabled = false;
  @Output() swipeDirection: EventEmitter<SwipeDirection> = new EventEmitter<SwipeDirection>();
  @Output() swipe: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();

  private startCoords: [number, number] | null = null;
  private startTime: number | null = null;

  constructor() {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.disabled) return;

    this.startCoords = [event.changedTouches[0].pageX, event.changedTouches[0].pageY];
    this.startTime = new Date().getTime();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (this.disabled || !this.startCoords || !this.startTime) return;

    const endCoords: [number, number] = [event.changedTouches[0].pageX, event.changedTouches[0].pageY];
    const time = new Date().getTime();
    const duration: number = time - this.startTime;

    const deltaX = endCoords[0] - this.startCoords[0];
    const deltaY = endCoords[1] - this.startCoords[1];

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    const horizontal = absX > absY;

    if (duration >= this.minDuration && duration <= this.maxDuration) {
      if (horizontal && absX > this.minDistance) {
        const direction: SwipeDirection = deltaX > 0 ? 'right' : 'left';
        this.emitSwipe(direction, deltaX, deltaY, duration, event);
      } else if (!horizontal && absY > this.minDistance) {
        const direction: SwipeDirection = deltaY > 0 ? 'down' : 'up';
        this.emitSwipe(direction, deltaX, deltaY, duration, event);
      }
    }

    this.startCoords = null;
    this.startTime = null;
  }

  private emitSwipe(direction: SwipeDirection, dx: number, dy: number, duration: number, event: TouchEvent): void {
    this.swipeDirection.emit(direction);
    this.swipe.emit({
      direction,
      distanceX: dx,
      distanceY: dy,
      duration,
      originalEvent: event,
    });
  }
}
