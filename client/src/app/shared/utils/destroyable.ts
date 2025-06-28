import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

//TODO DELETE Destroyable class???
@Injectable({ providedIn: 'root' })
export abstract class Destroyable {
  protected destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
