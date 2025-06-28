import { WordServiceInterface } from '@features/words/types';

import { InjectionToken } from '@angular/core';

export const WORD_SERVICE_TOKEN = new InjectionToken<WordServiceInterface>('WORD_SERVICE');
