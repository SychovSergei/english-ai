import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

export class CustomHttpErrorResponse<T> extends HttpErrorResponse {
  override error: T;

  constructor(init: CustomHttpErrorResponse<T>) {
    super({
      ...init,
      url: init.url ?? undefined, // Приводим `url` к типу `string | undefined`
      headers: init.headers ?? new HttpHeaders(),
    }); // Передаем остальные свойства в HttpErrorResponse
    this.error = init.error as T; // Устанавливаем типизированное свойство
  }
  // constructor(init: { error: T; status?: number; statusText?: string; url?: string; headers?: HttpHeaders }) {
  //   super(
  //     init,
  //     //url: init.url ?? undefined, // Приводим `url` к типу `string | undefined`
  //   ); // Передаем остальные свойства в HttpErrorResponse
  //   this.error = init.error as T; // Устанавливаем типизированное свойство
  // }
}

//// eslint-disable-next-line @typescript-eslint/no-empty-object-type
// export interface ApiErrorInterface<T = undefined> extends ApiErrorInterface<T> {
//   // status: number;
//   // code: string;
//   // message: string;
//   // validationErrors: ValidationError[];
//   // body?: ErrorBody<T>;
// }
