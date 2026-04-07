import * as FingerprintJS from '@fingerprintjs/fingerprintjs';

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FingerprintService {
  private visitorIdSignal = signal<string | null>(null);
  public readonly visitorId = this.visitorIdSignal.asReadonly();

  async identify(): Promise<string> {
    // Если уже определен, возвращаем сразу
    const currentId = this.visitorIdSignal();
    if (currentId) return currentId;

    const fp = await FingerprintJS.load();
    const result = await fp.get();

    this.visitorIdSignal.set(result.visitorId);
    return result.visitorId;
  }
}
