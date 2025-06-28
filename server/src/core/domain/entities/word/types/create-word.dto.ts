import { Word } from '@core/domain/entities';
import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

// export type CreateWordDto = z.infer<typeof createWordDtoSchema>;
export type CreateWordDto = Pick<Word, 'text' | 'language' | 'relatedForms' | 'sentences'> & {
  translations: WordCreateTranslation[];
};

type WordCreateTranslation = {
  id?: string;
  text: string;
  language: ELangs;
  description?: string;
  difficultyLevel: ELevels;
  lexicalCategory: ELexicalCategory;
};

// export type UpdateWordDto = z.infer<typeof updateWordDtoSchema>;
export type UpdateWordDto = Pick<Word, 'id' | 'text' | 'language' | 'relatedForms' | 'sentences'> & {
  // TODO при обновлении разве только эти параметры обновляются?
  translations: WordUpdateTranslation[];
};

// export type WordUpdateTranslation = z.infer<typeof wordUpdateTranslationSchema>;
export type WordUpdateTranslation = Required<WordCreateTranslation>;
