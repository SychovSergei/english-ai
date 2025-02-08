import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { ELevels } from "@shared/enums/levels.enum";
import { ELangs } from "@shared/enums/langs.enum";
import { Word } from "../../../core/entities/Word/word-schema";
import { ELexicalCategory } from "@shared/enums/lexical-categories.enum";

type WordModel = Model<Word>;

// Расширяем интерфейс для работы с Mongoose (Document)
// export interface WordDocument extends Word, Document {
//   _id: Types.ObjectId;
// }

/** MONGOOSE MODEL - WORD */
const wordSchema: Schema = new Schema<Word, WordModel>(
  {
    owner: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Владелец слова.
    isPublic: { type: Boolean, default: false }, // Общедоступность
    text: { type: String, required: true, unique: true }, // Текст слова
    language: { type: String, enum: Object.values(ELangs), required: true },
    relatedForms: [String], // Производные формы слова (e.g., runs, running).
    // translations: [{ type: Schema.Types.ObjectId, ref: EDbModels.Translation }], // Переводы слова
    translations: [
      {
        // _id: { type: Schema.Types.ObjectId, required: false }, // Id перевода
        language: { type: String, enum: Object.values(ELangs), required: true }, // Язык перевода
        text: { type: String, required: true }, // Текст перевода
        description: { type: String, required: false }, // Описание перевода
        difficultyLevel: { type: String, enum: Object.values(ELevels) },
        lexicalCategory: { type: String, enum: Object.values(ELexicalCategory) },
        // createdAt: { type: Date, required: true }, // Дата создания перевода
      },
    ], // Переводы слова
    sentences: [{ type: Schema.Types.ObjectId, ref: EDbModels.Sentence }], // Предложения, в которых это слово встречается
    // createdAt: { type: Date, default: Date.now }, // Дата создания слова
  },
  { timestamps: true },
);
// wordSchema.virtual("translationsWithId").get(function (this: { translations: WordTranslation[] }) {
//   return this.translations.map((translation) => ({
//     ...translation,
//     id: translation._id?.toString(),
//     _id: undefined, // Удаляем поле _id, если не нужно
//   }));
// });

wordSchema.set("toObject", {
  // virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;

    // Изменяем translations: заменяем _id на id
    // if (ret.translations) {
    //   ret.translations = (ret.translations as WordTranslation[]).map((translation) => {
    //     const { _id, ...rest } = translation;
    //     return {
    //       ...rest,
    //       id: _id?.toString,
    //     };
    //   });
    // }

    return ret;
  },
});

const WordModel: WordModel = model<Word, WordModel>(EDbModels.Word, wordSchema);

export default WordModel;
