import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, map, merge, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  public online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      const online$ = fromEvent(window, 'online').pipe(map(() => true));
      const offline$ = fromEvent(window, 'online').pipe(map(() => false));
      merge(online$, offline$, of(navigator.onLine)).subscribe((status) => {
        this.ngZone.run(() => this.online$.next(status));
      });
    });
  }

  isOnline(): boolean {
    return this.online$.value;
  }
}
