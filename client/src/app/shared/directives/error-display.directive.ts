import {
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 *  Directive for displaying validation error messages for form controls
 *  */
@Directive({
  selector: '[appErrorDisplay]',
  standalone: true,
})
export class ErrorDisplayDirective implements OnInit, OnDestroy {
  /** Default error message. */
  @Input() appErrorMessage: string = 'Incorrect value';
  /** Required container for displaying the error message. */
  @Input({ required: true }) appErrorContainer!: HTMLElement; //ElementRef;
  /** Required template for the error message. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input({ required: true }) appErrorTemplate!: TemplateRef<any>;

  private controlStatusSub?: Subscription;

  constructor(
    private viewContainer: ViewContainerRef,
    private control: NgControl,
  ) {}

  /**
   * Host listener for the 'blur' event, triggered when the control loses focus.
   * Update the error display based on the control's status.
   */
  @HostListener('blur')
  onBlur(): void {
    if (this.control.touched) {
      this.updateError(this.control.status);
    }
  }

  /**
   * Binding to add the error class to the control.
   * Returns true if the control is invalid and has been touched.
   */
  @HostBinding('class.is-invalid') get isInvalid(): boolean | null {
    return this.control?.invalid && this.control?.touched;
  }

  ngOnInit(): void {
    /**
     * Check if the control exists.
     * Subscribe to status changes of the control.
     */
    if (this.control) {
      this.controlStatusSub = this.control.statusChanges?.subscribe((status: string) => {
        this.updateError(status);
      });
    }
  }

  /**
   * If the status is "INVALID" and there are errors,
   * display the error message using the provided template.
   *
   */
  updateError(status: string | null): void {
    this.clearErrorMessageInTemplate();

    if (status === 'INVALID' && this.control.errors) {
      if (this.appErrorMessage) {
        this.showErrorMessage(this.appErrorMessage);
      }
    } else {
      this.clearErrorMessageInTemplate();
    }
  }

  /**
   * Clears the error message from the template.
   */
  clearErrorMessageInTemplate(): void {
    this.viewContainer.clear();
  }

  /**
   * Displays the error message using the provided template.
   * @param errorMessage The error message to be displayed.
   */
  private showErrorMessage(errorMessage: string): void {
    this.viewContainer.createEmbeddedView(this.appErrorTemplate, { $implicit: errorMessage });
  }

  ngOnDestroy(): void {
    if (this.controlStatusSub) this.controlStatusSub.unsubscribe();
  }
}
