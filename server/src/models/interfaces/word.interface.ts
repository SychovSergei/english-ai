import { Types } from "mongoose";
import { ITranslation } from "./translation.interface";
import { ELangs } from "../../enums/langs.enum";

export interface IWord {
  userId: Types.ObjectId; // Идентификатор пользователя
  originalText: string; // Оригинальный текст слова
  language: ELangs; // Язык оригинала
  description?: string; // Описание слова (необязательное поле)
  // translations: ITranslation[]; // Массив переводов
  translationIds: ITranslation[]; // Массив переводов
}
