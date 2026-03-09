import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

export interface UpdateTranslationData {
  id: string; // ID перевода (может быть новым или существующим)

  value: string;
  language: ELangs;
  description?: string;
  difficultyLevel?: ELevels;
  lexicalCategory?: ELexicalCategory;
}
