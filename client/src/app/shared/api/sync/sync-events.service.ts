import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type SyncEventType = 'words-changed' | 'user-changed';

@Injectable({ providedIn: 'root' })
export class SyncEventsService {
  private readonly _events = new Subject<SyncEventType>();
  public readonly events$ = this._events.asObservable(); // поток событий для фасадов

  public emit(type: SyncEventType): void {
    this._events.next(type);
  }
}
