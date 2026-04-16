import { Injectable, NgZone, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, map, merge, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private readonly _online = signal<boolean>(navigator.onLine);
  readonly online = this._online.asReadonly();
  readonly online$ = toObservable(this.online); // для RxJS/NgRx

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      const online$ = fromEvent(window, 'online').pipe(map(() => true));
      const offline$ = fromEvent(window, 'offline').pipe(map(() => false));
      merge(online$, offline$, of(navigator.onLine)).subscribe((status) => {
        this.ngZone.run(() => this._online.set(status));
      });
    });
  }

  isOnline(): boolean {
    return this._online();
  }
}
