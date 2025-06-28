import { IWordSetService } from '@entities/word-set';

import { InjectionToken } from '@angular/core';

// export const API_WORDS_URL = new InjectionToken<string>('API_WORDS_URL'); //TODO нужен ли?
export const WORD_SET_SERVICE_TOKEN = new InjectionToken<IWordSetService>('WORD_SET_SERVICE');
