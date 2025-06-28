import { z } from 'zod';

import { wordSchema } from '@core/domain/entities/word/schema/word.schema';
// import { wordSchema } from '@core/domain/entities';
import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { CustomZodObjectId } from '@core/domain/utils';

export const wordCreateTranslationSchema = z.object({
  id: z.string().default(''),
  text: z.string().min(1, 'Translated text is required. Перевод текста необходим.'),
  language: z.nativeEnum(ELangs),
  description: z.string().optional().default(''),
  difficultyLevel: z.nativeEnum(ELevels), // Уровень сложности
  lexicalCategory: z.nativeEnum(ELexicalCategory), // lexical categories (Noun, Verb)
});

export const wordUpdateTranslationSchema = z.object({
  _id: CustomZodObjectId.optional(),
  id: CustomZodObjectId.optional(),
  text: z.string().min(1, 'Translated text is required. Перевод текста необходим.'),
  language: z.nativeEnum(ELangs),
  description: z.string().optional().default(''),
  difficultyLevel: z.nativeEnum(ELevels), // Уровень сложности
  lexicalCategory: z.nativeEnum(ELexicalCategory), // lexical categories (Noun, Verb)
});

export const createWordDtoSchema = wordSchema
  .pick({
    text: true,
    language: true,
    relatedForms: true,
    sentences: true,
  })
  .extend({
    translations: z.array(wordCreateTranslationSchema),
  });

export const updateWordDtoSchema = wordSchema.pick({ id: true, text: true }).extend({
  translations: z.array(wordUpdateTranslationSchema), // Перезаписываем `translations` новой схемой
});
