import { z } from "zod";
import { WordRequestDtoSchema, WordTranslationSchema } from "../schemas/word-schemas";
import { ELangs } from "../../enums/langs.enum";
import { ITranslation } from "../interfaces/translation.interface";
import { Types } from "mongoose";

export type IWordRequestDto = z.infer<typeof WordRequestDtoSchema>;
export type IWordTranslation = z.infer<typeof WordTranslationSchema>;

export type ITranslationDto = Omit<ITranslation & { id: string }, "wordId">;
type IWordRequestDtoFiltered = Omit<IWordRequestDto & { id: string }, "userId">;

export interface IWordResponseDTO {
  length: number;
  data: WordResponseDTO[];
}

export class WordResponseDTO implements IWordRequestDtoFiltered {
  id: string;
  language: ELangs;
  originalText: string;
  translations: ITranslationDto[] = [];

  constructor(id: string, originalText: string, language: ELangs) {
    this.id = id;
    this.originalText = originalText;
    this.language = language;
    this.translations = [];
  }

  /**
   * Метод для загрузки переводов на основе массива ObjectId и обновления translations
   * @param translationIds - массив ObjectId
   * @param fetchTranslation - function for getting translations by ObjectId from db
   */
  async loadTranslations(
    translationIds: Types.ObjectId[],
    fetchTranslation: (id: Types.ObjectId) => Promise<ITranslationDto | null>,
  ) {
    const translations = await Promise.all(translationIds.map((id) => fetchTranslation(id)));
    this.translations = translations.filter((item) => item !== null);
  }
}
