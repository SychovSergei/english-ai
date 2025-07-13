import { HydratedDocument, Model, model, Schema, Types } from 'mongoose';

import { WordTranslation } from '@core/domain/entities';
import { Word } from '@core/domain/entities/word';
import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

export type WordTranslationSchemaType = WordTranslation & { _id: Types.ObjectId };
export type WordSchemaObject = Omit<Word, 'id' | 'translations'> & {
  _id: Types.ObjectId;
  translations: WordTranslationSchemaType[];
};
export type WordDocument = HydratedDocument<WordSchemaObject>;
type WordModel = Model<WordDocument>;

// type WordTranslationSubDoc = WordTranslation & { _id: Types.ObjectId };

// type WordObjectType = Omit<Word, 'translations'> & {
//   id: string;
//   translations: WordTranslationSchemaType[];
// };
// <WordTranslationSubDoc>
const WordTranslationSchema = new Schema(
  {
    text: { type: String, required: true },
    language: { type: String, enum: Object.values(ELangs), required: true },
    description: { type: String },
    difficultyLevel: { type: String, enum: Object.values(ELevels) },
    lexicalCategory: { type: String, enum: Object.values(ELexicalCategory) },
  },
  { _id: true }, // ВАЖНО: включить _id для доступа через .id()
);

/** MONGOOSE MODEL - WORD <WordDocument, WordModel>*/
const wordSchema: Schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Владелец слова.
    text: { type: String, required: true, unique: true }, // Текст слова
    language: { type: String, enum: Object.values(ELangs), required: true },
    translations: { type: [WordTranslationSchema], default: [] }, // Переводы
    //   {
    //     // id: { type: Schema.Types.ObjectId, required: true, unique: true }, // Индекс перевода (ObjectId)
    //     text: { type: String, required: true }, // Текст перевода
    //     language: { type: String, enum: Object.values(ELangs), required: true }, // Язык перевода
    //     description: { type: String, required: false }, // Описание перевода
    //     difficultyLevel: { type: String, enum: Object.values(ELevels), required: false },
    //     lexicalCategory: { type: String, enum: Object.values(ELexicalCategory), required: false },
    //   },
    // ], // Переводы
    sentences: [{ type: Schema.Types.ObjectId, ref: EDbModels.Sentence }], // Предложения, в которых это слово встречается
    relatedForms: [{ type: String, required: true }], // Производные формы слова (e.g., runs, running).
    isPublic: { type: Boolean, default: false }, // Общедоступность
  },
  { timestamps: true },
);

wordSchema.set('toObject', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;

    // Изменяем translations: заменяем _id на id
    if (ret.translations) {
      ret.translations = (ret.translations as WordTranslationSchemaType[]).map((translation) => {
        const { _id, ...rest } = translation;
        return {
          ...rest,
          id: _id?.toString(),
        };
      });
    }

    return ret;
  },
});
//
//
export const WordModel: WordModel = model<WordDocument, WordModel>(EDbModels.Word, wordSchema);
// export const WordModel: WordModel = model<WordDbDto, WordModel>(EDbModels.Word, wordSchema);
