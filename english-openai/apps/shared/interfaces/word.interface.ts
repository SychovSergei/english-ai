import { ELevels } from "@shared/enums/levels.enum";
import { ELangs } from "@shared/enums/langs.enum";
import {
  CreateWordDTO,
  GetWordsResponse,
  UpdateWordDTO,
  Word,
} from "../../server/src/core/entities/Word/word-schema";
import {
  WordTranslation,
  WordUpdateTranslation,
} from "../../server/src/infractructure/db/entities/schemas/word-translation-schema";

export interface SharedWord extends Word {}

// Общий интерфейс для создания слова (без полей, генерируемых автоматически)
export interface SharedCreateWordDTO extends CreateWordDTO {} //Omit<IWord, "owner" | "createdAt">;

export type CreateWordResponse = SharedWord;

// Интерфейс для редактирования слова (например, через PATCH)
export interface SharedUpdateWordDTO extends UpdateWordDTO {} //Partial<
export interface SharedWordUpdateTranslationDTO extends WordUpdateTranslation {} //Partial<

export type SharedUpdateWordResponse = UpdateWordDTO; // Все поля необязательные

export interface SharedDeleteWordRequest {
  wordId: string;
}
export interface SharedDeleteWordResponse {
  success: boolean;
  message: string;
}

export interface GetWordsRequest {
  owner?: string;
  isPublic?: boolean;
  language?: ELangs;
  difficultyLevel?: ELevels;
  page?: number; // Для пагинации
  limit?: number; // Количество записей на страницу
}

// Интерфейс для списка слов
export interface SharedGetWordsResponse extends GetWordsResponse {}

export interface SharedWordTranslation extends WordTranslation {}
