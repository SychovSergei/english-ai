import { Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  private _isOnline = signal<boolean>(navigator.onLine);
  public readonly isOnline = this._isOnline.asReadonly();

  constructor() {
    // this.runSync(); // Как только вышли в онлайн — запускаем синхронизацию
    fromEvent(window, 'online').subscribe(() => this._isOnline.set(true));
    fromEvent(window, 'offline').subscribe(() => this._isOnline.set(false));
  }

  /**
   *Позволяет принудительно проверить связь через пинг (если нужно)
   */
  async checkRealConnection(): Promise<boolean> {
    try {
      await fetch('/api/health', { method: 'HEAD', cache: 'no-store' });
      this._isOnline.set(true);
      return true;
    } catch (e) {
      console.log(e);
      this._isOnline.set(false);
      return false;
    }
  }
}
