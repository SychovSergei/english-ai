import { z } from 'zod';

import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { CustomZodObjectId } from '@core/domain/utils';

/** It must be matched with IWordTranslation interface
 *  It is the source for database properties */
export const wordTranslationZodSchema = z.object({
  // _id: CustomZodObjectId.optional(),
  id: z.string().optional(), //CustomZodObjectId, //.optional(),
  text: z.string().min(1, 'Translated text is required. Перевод текста необходим.'),
  language: z.nativeEnum(ELangs),
  description: z.string().default(''), //.optional()
  difficultyLevel: z.nativeEnum(ELevels), // Уровень сложности
  lexicalCategory: z.nativeEnum(ELexicalCategory), // lexical categories (Noun, Verb)
});

// type WordTranslation = z.infer<typeof wordTranslationZodSchema>;
