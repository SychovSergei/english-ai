import { z } from 'zod';

import { ELangs } from '@core/domain/enums';
import { EWordSetVisibility } from '@core/domain/enums/word-set-visibility.enum';
import { CustomZodObjectId } from '@core/domain/utils';

export const wordSetSettingsSchema = z.object({
  visibility: z.nativeEnum(EWordSetVisibility).default(EWordSetVisibility.Private),
  passwordHash: z.string().optional(),
  language: z.nativeEnum(ELangs, { errorMap: () => ({ message: 'Invalid language' }) }), // Язык оригинала
  allowCopy: z.boolean().describe('Indicates if the word is public'), // Общедоступность
});

export const wordSetSchema = z.object({
  id: z.string().optional(), // Идентификатор слова
  // id: CustomZodObjectId.optional(), // Идентификатор слова
  // _id: CustomZodObjectId.optional(), // Идентификатор слова

  title: z.string().min(2, 'Word Set title is required'), // Оригинальный текст слова;
  description: z.string().optional(),
  ownerId: CustomZodObjectId,
  //sharedWith: z.array(z.string()).optional().default([]),
  // createdAt: z
  //   .date({ required_error: 'Creation date is required', invalid_type_error: 'Invalid date format' })
  //   .optional(), // Дата создания слова,

  settings: wordSetSettingsSchema,

  words: z.array(z.string()).default([]),
});

/**
 const ddd: CreateWordSetDto = {
   title: '',
   description: '',
   settings: { visibility: EWordSetVisibility.Private, language: ELangs.EN, allowCopy: false, passwordHash: '' },
   words: [{ term: '', definition: '' }],
 };
 */
