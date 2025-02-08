import { z } from "zod";
import { ELangs } from "@shared/enums/langs.enum";
import {
  wordTranslationSchema,
  wordUpdateTranslationSchema,
} from "../../../infractructure/db/entities/schemas/word-translation-schema";
import { CustomZodObjectId } from "../../../infractructure/db/entities/schemas/custom-zod-validators";

/** It must be matched with IWord interface
 *  It is the source for database properties */
export const wordSchema = z.object({
  id: CustomZodObjectId.optional(), // Идентификатор слова
  _id: CustomZodObjectId.optional(), // Идентификатор слова
  owner: CustomZodObjectId.optional(), //z.string().length(24), // Идентификатор пользователя
  isPublic: z.boolean(), // Общедоступность
  text: z.string().min(1, "Original text is required"), // Оригинальный текст слова
  language: z.nativeEnum(ELangs), // Язык оригинала
  relatedForms: z.array(z.string()), // Производные формы слова (e.g., runs, running).
  translations: z.array(wordTranslationSchema), // Массив переводов
  sentences: z.array(CustomZodObjectId), // Предложения, в которых это слово встречается (язык оригинала) // TODO ???
  createdAt: z.date(), // Дата создания слова
});
export type Word = z.infer<typeof wordSchema>;
// export type WordModelMongo = z.infer<typeof wordSchema>;

export const getWordsResponse = z.object({
  // success: boolean;
  data: z.array(wordSchema), // Word[];
  total: z.number(), // common amount words
  // page: number;
  // limit: number;
});
export type GetWordsResponse = z.infer<typeof getWordsResponse>;

// export const createWordSchema = wordSchema.pick({
//   text: true,
//   language: true,
//   relatedForms: true,
//   translations: true,
//   sentences: true,
// });
// export type CreateWordDTO = z.infer<typeof createWordSchema>;

export const updateWordSchema = wordSchema.pick({ id: true, text: true }).extend({
  translations: z.array(wordUpdateTranslationSchema), // Перезаписываем `translations` новой схемой
});
export type UpdateWordDTO = z.infer<typeof updateWordSchema>;

// z.object({
//   isPublic: z.boolean().default(false),
//   text: z.string().min(1, "Word text is required"),
//   language: z.nativeEnum(ELangs),
//   // description: z.string(),
//   relatedForms: z.array(z.string()).default([]),
//
//   translations: z.array(wordTranslationSchema),
//
//   sentences: z.array(z.string()).default([]),
//   difficultyLevel: z.nativeEnum(ELevels),
// });
