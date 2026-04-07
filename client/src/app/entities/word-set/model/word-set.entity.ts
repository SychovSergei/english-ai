import { WordEntity } from '@entities/word/@x/word-set';
import { WordSetId } from '@entities/word-set/model/word-set-id.vo';
import { ELangs, EWordSetVisibility } from '@shared/enums';

// export interface WordSet<T> extends HasId {
export class WordSetEntity {
  constructor(public readonly id: WordSetId) {}
  title: string;
  description?: string;
  ownerId?: string;
  words: WordEntity[]; //Word || WordItem //TODO импорт из сущности на одном уровне (противоречит FSD)????
  settings: WordSetSettings;
}

export interface WordSetSettings {
  visibility: EWordSetVisibility;
  passwordHash?: string;
  language: ELangs;
  allowCopy: boolean;
}

// export const wordSetSchema = z.object({
//   id: string optional,
//
//   title: string,
//   description: string optional,
//   ownerId: string,
//   words: array string optional default([]),
//   sharedWith: array string optional default([]),
//   settings: wordSetSettingsSchema,
//   createdAt: z.date({ required_error: 'Creation date is required', invalid_type_error: 'Invalid date format' }), // Дата создания слова,
// });
