import { WordTranslation } from '@entities/word/model/word.types';
import { ELangs } from '@shared/enums';

export type WordFormValue = WordFormBaseControls & WordFormTranslationControls;

export interface WordFormBaseControls {
  id: string;
  text: string;
  language: ELangs;
}

export interface WordFormTranslationControls {
  translations: WordFormTranslation<WordTranslation>[];
}

export type WordFormTranslation<T extends WordTranslation> = Omit<T, 'text'> & {
  translText: T['text'];
};
