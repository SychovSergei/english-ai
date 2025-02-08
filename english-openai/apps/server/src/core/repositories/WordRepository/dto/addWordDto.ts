import { z } from "zod";
import { wordSchema } from "../../../entities/Word/word-schema";

export const addWordDTOSchema = wordSchema.pick({
  text: true,
  language: true,
  relatedForms: true,
  translations: true,
  sentences: true,
});

export type AddWordDTO = z.infer<typeof addWordDTOSchema>;

// import { z, ZodArray, ZodBoolean, ZodDate, ZodNativeEnum, ZodString } from "zod";
// import { WordRequestDtoSchema, WordTranslationSchema } from "../schemas/word-schema";
// import { ELangs } from "../../enums/langs.enum";
// import { ITranslation } from "@shared/interfaces--/word-translation.interface";
// import { Promise, Types } from "mongoose";
//
// export type IWordRequestDto = z.infer<typeof WordRequestDtoSchema>;
// export type IWordTranslation = z.infer<typeof WordTranslationSchema>;
//
// export type ITranslationDto = Omit<ITranslation & { id: string }, "wordId">;
// type IWordRequestDtoFiltered = Omit<IWordRequestDto & { id: string }, "owner">;
//
// export interface IWordResponseDTO {
//   length: number;
//   data: WordResponseDTO[];
// }
//
// export class WordResponseDTO implements IWordRequestDtoFiltered {
//   id: string;
//   language: ELangs;
//   text: string;
//   translations: ITranslationDto[] = [];
//
//   // createdAt: ZodDate["_output"];
//   // difficultyLevel: ZodNativeEnum<ELevels>["_output"];
//   // isPublic: ZodBoolean["_output"];
//   // sentences: ZodArray<ZodString, "many">["_output"];
//
//   constructor(id: string, text: string, language: ELangs) {
//     this.id = id;
//     this.text = text;
//     this.language = language;
//     this.translations = [];
//   }
//
//   /**
//    * Метод для загрузки переводов на основе массива ObjectId и обновления translations
//    * @param translationIds - массив ObjectId
//    * @param fetchTranslation - function for getting translations by ObjectId from db
//    */
//   async loadTranslations(
//     translationIds: Types.ObjectId[],
//     fetchTranslation: (id: Types.ObjectId) => Promise<ITranslationDto | null>,
//   ) {
//     const translations = await Promise.all(translationIds.map((id) => fetchTranslation(id)));
//     this.translations = translations.filter((item) => item !== null);
//   }
// }
