import { WordTranslation } from '@entities/word/model/word.model';

export interface WordTranslationExtension extends WordTranslation {
  isNew: boolean;
}
