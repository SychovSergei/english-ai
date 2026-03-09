import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

/** It must be matched with IWordTranslation interface
 *  It is the source for database properties */
export type WordTranslation = {
  id?: string;
  text: string;
  language: ELangs;
  description?: string;
  difficultyLevel: ELevels;
  lexicalCategory: ELexicalCategory;
};
