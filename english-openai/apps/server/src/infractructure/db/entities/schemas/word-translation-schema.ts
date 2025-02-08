import { z } from "zod";
import { ELangs } from "@shared/enums/langs.enum";
import { CustomZodObjectId } from "./custom-zod-validators";
import { ELevels } from "@shared/enums/levels.enum";
import { ELexicalCategory } from "@shared/enums/lexical-categories.enum";

/** It must be matched with IWordTranslation interface
 *  It is the source for database properties */
export const wordTranslationSchema = z.object({
  _id: CustomZodObjectId.optional(),
  id: CustomZodObjectId.optional(),
  // createdAt: z.date(),
  text: z.string().min(1, "Translated text is required. Перевод текста необходим."),
  language: z.nativeEnum(ELangs),
  description: z.string().optional().default(""),
  difficultyLevel: z.nativeEnum(ELevels), // Уровень сложности
  lexicalCategory: z.nativeEnum(ELexicalCategory), // lexical categories (Noun, Verb)
});
export type WordTranslation = z.infer<typeof wordTranslationSchema>;

export const wordUpdateTranslationSchema = z.object({
  _id: CustomZodObjectId.optional(),
  id: CustomZodObjectId.optional(),
  text: z.string().min(1, "Translated text is required. Перевод текста необходим."),
  language: z.nativeEnum(ELangs),
  description: z.string().optional().default(""),
  difficultyLevel: z.nativeEnum(ELevels), // Уровень сложности
  lexicalCategory: z.nativeEnum(ELexicalCategory), // lexical categories (Noun, Verb)
});
export type WordUpdateTranslation = z.infer<typeof wordUpdateTranslationSchema>;
