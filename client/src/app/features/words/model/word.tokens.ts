import { WordServiceInterface } from '@features/words/types';

import { InjectionToken } from '@angular/core';

// export const API_WORDS_URL = new InjectionToken<string>('API_WORDS_URL'); //TODO нужен ли?
export const WORD_SERVICE_TOKEN = new InjectionToken<WordServiceInterface>('WORD_SERVICE');
