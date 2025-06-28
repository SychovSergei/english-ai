import { WordSet } from '@entities/word-set/models';
import { ELangs, EWordSetVisibility } from '@shared/enums';

export function createEmptyWordSet<T>(): WordSet<T> {
  return {
    id: '',
    title: '',
    description: '',
    ownerId: '',
    words: [],
    settings: {
      visibility: EWordSetVisibility.Private,
      language: ELangs.EN,
      allowCopy: true,
    },
  };
}
