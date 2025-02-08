import { InjectionToken } from '@angular/core';

import { IWordService } from '../interfaces/word-service.interface';

export const WORD_SERVICE_TOKEN = new InjectionToken<IWordService>('WORD_SERVICE');
