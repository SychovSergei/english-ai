import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { IWord } from "./interfaces/word.interface";

type WordModel = Model<IWord>;

const wordSchema: Schema = new Schema<IWord, WordModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: EDbModels.User,
    required: true,
  },
  originalText: { type: String, required: true, unique: true },
  language: { type: String, required: true },
  // translations: [translationSchema], // Массив ссылок на переводы
  translationIds: [
    {
      type: Schema.Types.ObjectId,
      ref: EDbModels.Translation,
    },
  ],
});

const WordModel: WordModel = model<IWord, WordModel>(EDbModels.Word, wordSchema);

export default WordModel;
