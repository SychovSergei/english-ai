import { Model, model, Schema } from 'mongoose';

import { Sentence } from '@core/domain/entities';
import { ELangs, ELevels, ESource } from '@core/domain/enums';
import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

// TODO куда переместить?

type SentenceModel = Model<Sentence>;

const sentenceSchema: Schema = new Schema<Sentence, SentenceModel>({
  text: { type: String, required: true }, // Исходное предложение на английском
  linkedWords: [{ type: Schema.Types.ObjectId, ref: EDbModels.Word }], // Слова, используемые в предложении
  translations: [
    {
      lang: { type: String, enum: Object.values(ELangs), required: true },
      text: { type: String, required: true },
    },
  ], // Переводы предложения
  source: { type: String, enum: Object.values(ESource), required: true }, // Источник генерации
  difficultyLevel: { type: String, enum: Object.values(ELevels) }, // Уровень сложности
  createdAt: { type: Date, default: Date.now }, // Дата создания
});

export const SentenceModel: SentenceModel = model<Sentence, SentenceModel>(EDbModels.Sentence, sentenceSchema);
