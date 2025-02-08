import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { WordTranslation } from "./schemas/word-translation-schema";

type WordTranslationModel = Model<WordTranslation>;

export const wordTranslationSchema: Schema = new Schema<WordTranslation, WordTranslationModel>({
  // word: { type: Schema.Types.ObjectId, ref: EDbModels.Word, required: true }, // Индекс слова
  text: { type: String, required: true }, // Текст перевода
  language: { type: String, required: true }, // Язык перевода
  description: { type: String, required: false }, // Описание перевода
  // createdAt: { type: Date, default: Date.now }, // Дата создания перевода
});

const TranslationModel: WordTranslationModel = model<WordTranslation, WordTranslationModel>(
  EDbModels.Translation,
  wordTranslationSchema,
);

export default TranslationModel;
