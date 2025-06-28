import { Model, model, Schema } from 'mongoose';

import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

// TODO path check
export interface ISentenceCheck {
  sentence: Schema.Types.ObjectId; // Проверяемое предложение
  userAnswer: string; // Ответ пользователя
  isCorrect: boolean; // Правильность
  hints: string[]; // Подсказки для исправления
  corrections: string; // Исправленный текст
  rulesViolated: string[]; // Нарушенные правила
  checkedAt: Date; // Дата проверки
}

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

export const SentenceCheckSchemaModel: SentenceCheckModel = model<ISentenceCheck, SentenceCheckModel>(
  EDbModels.SentenceCheck,
  sentenceCheckSchema,
);

// export default SentenceCheckSchemaModel;
