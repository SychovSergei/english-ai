import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { IWordSet } from "@shared/interfaces/word-set.interface";

type WordSetModel = Model<IWordSet>;
const wordSetSchema: Schema = new Schema<IWordSet, WordSetModel>({
  name: { type: String, required: true }, // Название набора слов
  description: { type: String }, // Описание набора слов
  owner: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Владелец набора слов
  words: [{ type: Schema.Types.ObjectId, ref: EDbModels.Word }], // Слова, входящие в набор
  sharedWith: [{ type: Schema.Types.ObjectId, ref: EDbModels.User }], // Пользователи, с которыми набор слов поделился
  createdAt: { type: Date, default: Date.now }, // Дата создания набора
});

const WordSetModel: WordSetModel = model<IWordSet, WordSetModel>(EDbModels.WordSet, wordSetSchema);

export default WordSetModel;
