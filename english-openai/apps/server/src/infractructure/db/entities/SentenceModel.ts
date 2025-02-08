import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { ISentence } from "@shared/interfaces/sentence.interface";
import { ESource } from "@shared/enums/source.enum";
import { ELevels } from "@shared/enums/levels.enum";
import { ELangs } from "@shared/enums/langs.enum";

type SentenceModel = Model<ISentence<Schema.Types.ObjectId>>;
const sentenceSchema: Schema = new Schema<ISentence<Schema.Types.ObjectId>, SentenceModel>({
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

const SentenceModel: SentenceModel = model<ISentence<Schema.Types.ObjectId>, SentenceModel>(
  EDbModels.Sentence,
  sentenceSchema,
);

export default SentenceModel;
