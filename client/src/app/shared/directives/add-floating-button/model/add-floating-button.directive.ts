import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { FloatButtonComponent } from '../ui';

@Directive({
  selector: '[appAddFloatingButton]',
  // standalone: true,
})
export class FloatingButtonDirective implements AfterViewInit, OnDestroy {
  @Input({ required: true }) buttonClick!: () => void;

  private buttonRef: ComponentRef<FloatButtonComponent> | undefined;
  private sub?: Subscription;

  constructor(
    private el: ElementRef,
    private vcr: ViewContainerRef,
  ) {}

  @HostListener('click', ['$event.target'])
  onClick(): void {}

  @HostListener('mouseenter', ['$event.target'])
  onMouseEnter(): void {
    if (this.buttonRef) {
      this.buttonRef.instance.isVisible = true;
      this.buttonRef.instance.visibleState = 'visible';
    }
  }

  @HostListener('mouseleave', ['$event.target'])
  onMouseLeave(): void {
    if (this.buttonRef) this.buttonRef.instance.visibleState = 'hidden';
  }

  ngAfterViewInit(): void {
    this.buttonRef = this.vcr.createComponent(FloatButtonComponent);
    this.buttonRef.instance.visibleState = 'hidden';

    const hostElement = this.el.nativeElement as HTMLElement;
    const buttonElement = this.buttonRef.location.nativeElement as HTMLElement;
    hostElement.appendChild(buttonElement);

    this.sub = this.buttonRef.instance.clicked.subscribe(() => {
      if (this.buttonClick) {
        this.buttonClick();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();

    if (this.buttonRef) {
      this.buttonRef.destroy();
    }
  }
}
