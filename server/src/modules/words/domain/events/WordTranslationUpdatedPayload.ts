import { TranslationId } from '@modules/words/domain/value-objects';

export interface WordTranslationUpdatedPayload {
  wordId: string;
  translationId: TranslationId;
}
