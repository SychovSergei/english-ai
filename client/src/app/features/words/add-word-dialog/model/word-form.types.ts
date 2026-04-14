// import { WordTranslation } from '@entities/word/model/word.types';
import { WordTranslation } from '@entities/word';
import { ELangs } from '@shared/enums';

export type WordFormValue = WordFormBaseControls & WordFormTranslationControls;

export interface WordFormBaseControls {
  id: string;
  value: string;
  language: ELangs;
}

export interface WordFormTranslationControls {
  translations: WordFormTranslation<WordTranslation>[];
}

export type WordFormTranslation<T extends WordTranslation> = Omit<T, 'id' | 'value'> & {
  id: string;
  translText: T['value'];
};
