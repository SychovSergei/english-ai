import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { ISentenceCheck } from "@shared/interfaces/sentence-check.interface";

type SentenceCheckModel = Model<ISentenceCheck>;
const sentenceCheckSchema: Schema = new Schema<ISentenceCheck, SentenceCheckModel>({
  sentence: { type: Schema.Types.ObjectId, ref: EDbModels.Sentence, required: true }, // Проверяемое предложение
  userAnswer: { type: String, required: true }, // Ответ пользователя
  isCorrect: { type: Boolean, required: true }, // Правильность
  hints: [{ type: String }], // Подсказки для исправления
  corrections: { type: String }, // Исправленный текст
  rulesViolated: [{ type: String }], // Нарушенные правила
  checkedAt: { type: Date, default: Date.now }, // Дата проверки
});

const SentenceCheckSchemaModel: SentenceCheckModel = model<ISentenceCheck, SentenceCheckModel>(
  EDbModels.TrainingSession,
  sentenceCheckSchema,
);

export default SentenceCheckSchemaModel;
