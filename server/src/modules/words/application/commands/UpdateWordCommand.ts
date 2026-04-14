import { AppValidationError } from '@core/domain/errors';
import { UpdateTranslationData } from '@modules/words/domain/contracts/UpdateTranslationData';
import { ImageAssociation } from '@modules/words/domain/value-objects';

// Что пришло от клиента.
// Обычно это примитивы (string, number).
// Обязательно содержит id, чтобы найти слово.
export interface UpdateWordPayload {
  id: string; // ID самого слова
  value?: string;
  sense?: string | null;
  isPublic?: boolean;
  image?: ImageAssociation | null;
  // language: string;

  translations?: UpdateTranslationData[];
}

export class UpdateWordCommand {
  private constructor(public readonly payload: UpdateWordPayload) {}

  public static create(payload: UpdateWordPayload): UpdateWordCommand {
    if (!payload.id) throw AppValidationError.singleField('word', 'id', 'ID is required');
    // Здесь можно добавить валидацию (ZOD или другая): если translations переданы, они не должны быть пустыми
    return new UpdateWordCommand(payload);
  }
}
