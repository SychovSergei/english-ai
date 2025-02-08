import { WordTranslation } from "../../server/src/infractructure/db/entities/schemas/word-translation-schema";

export interface SharedWordTranslation extends WordTranslation {
  // createdAt: Date; // Дата создания перевода
  // description: string; // Описание перевода
  // language: ELangs; // Язык перевода
  // text: string; // Текст перевода
}
