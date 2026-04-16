import { environment } from '@environments/environment';

import { Injectable } from '@angular/core';

type LogArgs = unknown[];

@Injectable({ providedIn: 'root' })
export class LoggerService {
  createLogger(ctx: string): {
    log: (message: string, ...args: LogArgs) => void;
    error: (message: string, ...args: LogArgs) => void;
    warn: (message: string, ...args: LogArgs) => void;
    clear: () => void;
  } {
    return {
      log: this.buildLogger('LOG', ctx),
      error: this.buildLogger('ERROR', ctx),
      warn: this.buildLogger('WARN', ctx),
      clear: () => console.clear(),
    };
  }

  private buildLogger(level: string, ctx: string): (message: string, ...args: LogArgs) => void {
    switch (level) {
      case 'LOG':
        return (message: string, ...args: LogArgs) => {
          if (environment.production) return;
          console.log(`[${level} ${ctx}]: `, message, ...args);
        };
      case 'ERROR':
        return (message: string, ...args: LogArgs) => {
          console.error(`[${level} ${ctx}]: `, message, ...args);
        };
      case 'WARN':
        return (message: string, ...args: LogArgs) => {
          if (environment.production) return;
          console.warn(`[${level} ${ctx}]: `, message, ...args);
        };
      default:
        return () => {};
    }
  }
}
