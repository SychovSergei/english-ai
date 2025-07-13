import { z } from 'zod';

import { wordTranslationZodSchema } from '@core/domain/entities/word-translation/schema/word-translation.schema';
// import { wordTranslationZodSchema } from '@core/domain/entities';
import { ELangs } from '@core/domain/enums';
import { CustomZodObjectId } from '@core/domain/utils';

/** It must be matched with Word interface
 *  It is the source for database properties */
export const wordSchema = z.object({
  id: z.string().optional(), //CustomZodObjectId,//, // Идентификатор слова
  // _id: CustomZodObjectId.optional(), // Идентификатор слова
  owner: CustomZodObjectId.optional(), //z.string().length(24), // Идентификатор пользователя
  isPublic: z.boolean().describe('Indicates if the word is public'), // Общедоступность
  text: z.string().min(1, 'Original text is required'), // Оригинальный текст слова
  language: z.nativeEnum(ELangs, { errorMap: () => ({ message: 'Invalid language' }) }), // Язык оригинала
  relatedForms: z.array(z.string()).default([]), //.optional() Производные формы слова (e.g., runs, running).
  translations: z.array(wordTranslationZodSchema).refine((arr) => arr.length > 0, {
    message: 'At least one translation is required',
  }), // Массив переводов// Ошибка, если массив пустой
  sentences: z.array(CustomZodObjectId).optional().default([]), // Предложения, в которых это слово встречается (язык оригинала) // TODO ???
  // createdAt: z.date({ required_error: 'Creation date is required', invalid_type_error: 'Invalid date format' }), // Дата создания слова
});

export const getWordsResponse = z.object({
  data: z.array(wordSchema), // Word[];
  total: z.number(), // common amount words
});
