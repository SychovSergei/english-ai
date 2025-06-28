import { ELangs, EWordSetVisibility } from '@shared/enums';
import { HasId } from '@shared/interfaces';

export interface WordSet<T> extends HasId {
  title: string;
  description?: string;
  ownerId?: string;
  words: T[]; //Word || WordItem //TODO импорт из сущности на одном уровне (противоречит FSD)????
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
