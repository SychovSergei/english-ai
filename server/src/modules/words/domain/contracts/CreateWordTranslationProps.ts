import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { TranslationId } from '@modules/words/domain/value-objects';

export interface CreateWordTranslationsProps {
  id: TranslationId; // 👈 id приходит снаружи (use case)
  value: string;
  language: ELangs;
  description?: string;
  difficultyLevel?: ELevels;
  lexicalCategory?: ELexicalCategory;
}
