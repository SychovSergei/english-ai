import { z } from "zod";
import { CustomZodObjectId } from "../../../infractructure/db/entities/schemas/custom-zod-validators";
import { ELangs } from "@shared/enums/langs.enum";
import { wordTranslationSchema } from "../../../infractructure/db/entities/schemas/word-translation-schema";

// export const wordSchema = z.object({
//   id: CustomZodObjectId.optional(), // Идентификатор слова
//   _id: CustomZodObjectId.optional(), // Идентификатор слова
//   owner: CustomZodObjectId.optional(), //z.string().length(24), // Идентификатор пользователя
//   isPublic: z.boolean(), // Общедоступность
//   text: z.string().min(1, "Original text is required"), // Оригинальный текст слова
//   language: z.nativeEnum(ELangs), // Язык оригинала
//   relatedForms: z.array(z.string()), // Производные формы слова (e.g., runs, running).
//   translations: z.array(wordTranslationSchema), // Массив переводов
//   sentences: z.array(CustomZodObjectId), // Предложения, в которых это слово встречается (язык оригинала) // TODO ???
//   createdAt: z.date(), // Дата создания слова
// });

export class WordEntity {
  constructor(
    readonly id: string,
    readonly owner: string,
    readonly isPublic: boolean,
    readonly value: boolean, // instead "text"
    readonly language: ELangs,
    readonly relatedForms: string[],
    readonly translations: string[],
    readonly sentences: string[],
  ) {}
}
