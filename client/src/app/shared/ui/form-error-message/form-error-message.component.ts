import { Component, Input, signal, WritableSignal } from '@angular/core';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-form-error-message',
  standalone: true,
  imports: [MatError],
  templateUrl: './form-error-message.component.html',
  styleUrl: './form-error-message.component.scss',
})
export class FormErrorMessageComponent {
  private _message: WritableSignal<string> = signal('');

  @Input()
  set errorMessage(val: string) {
    this._message.set(val);
  }

  get errorMessage(): string {
    return this._message();
  }
}
