import { FadeScale } from './fade-scale.animation';

type TVisible = 'hidden' | 'visible';

import { AnimationEvent } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-float-button',
  templateUrl: './float-button.component.html',
  styleUrls: ['./float-button.component.scss'],
  animations: [FadeScale],
})
export class FloatButtonComponent implements AfterViewInit {
  @Input() visibleState: TVisible = 'hidden';
  isVisible = false;

  @Output() clicked = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.isVisible = false;
    this.visibleState = 'hidden';
    this.cdr.detectChanges();
  }

  buttonClick(): void {
    console.log('FloatButtonComponent buttonClick');
    this.clicked.emit();
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'hidden') {
      this.isVisible = false;
      this.cdr.detectChanges(); // нужно обновить шаблон
    }
  }
}
