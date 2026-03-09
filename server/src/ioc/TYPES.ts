import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';
import { WORDS_TYPES } from '@modules/words/constants/words.types';

export const TYPES = {
  ...CORE_TYPES,
  ...AUTH_TYPES,
  ...WORDS_TYPES,
};
