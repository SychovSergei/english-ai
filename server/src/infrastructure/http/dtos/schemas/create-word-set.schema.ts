import { z } from 'zod';

import { wordSetSettingsSchema } from '@core/domain/entities/word-set';

export const createWordSetWordDtoSchema = z.object({
  term: z.string().min(2, 'Word term is required'), // Оригинальный текст слова;,
  definition: z.string().min(2, 'Word definition is required'), // Оригинальный текст слова;
});
export const updateWordSetWordDtoSchema = z.object({
  id: z.string(),
  term: z.string().min(2, 'Word term is required'), // Оригинальный текст слова;,
  definition: z.string().min(2, 'Word definition is required'), // Оригинальный текст слова;
});

export const createWordSetDtoSchema = z.object({
  title: z.string().min(2, 'Word Set title is required'), // Оригинальный текст слова;
  description: z.string().optional(),
  settings: wordSetSettingsSchema,
  words: z.array(createWordSetWordDtoSchema),
});
