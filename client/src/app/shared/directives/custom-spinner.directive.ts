import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[customSpinner]',
  standalone: true,
})
export class CustomSpinnerDirective implements AfterViewInit {
  @Input('customColor') color!: string;

  constructor(private _elRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.color) {
      const element = this._elRef.nativeElement;
      const circleAll = element.querySelectorAll('circle');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      circleAll.forEach((item: any) => {
        item.style.stroke = this.color;
      });
    }
  }
}
