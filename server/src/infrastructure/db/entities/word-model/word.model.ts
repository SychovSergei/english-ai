import { Model, model, Schema } from 'mongoose';

import { WordDbDto, WordTranslationDbDto } from '@core/domain/entities/word';
import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

type WordModel = Model<WordDbDto>;

/** MONGOOSE MODEL - WORD */
const wordSchema: Schema = new Schema<WordDbDto, WordModel>(
  {
    owner: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Владелец слова.
    text: { type: String, required: true, unique: true }, // Текст слова
    language: { type: String, enum: Object.values(ELangs), required: true },
    translations: [
      {
        // id: { type: Schema.Types.ObjectId, required: true }, // Индекс перевода (ObjectId)
        text: { type: String, required: true }, // Текст перевода
        language: { type: String, enum: Object.values(ELangs), required: true }, // Язык перевода
        description: { type: String, required: false }, // Описание перевода
        difficultyLevel: { type: String, enum: Object.values(ELevels), required: false },
        lexicalCategory: { type: String, enum: Object.values(ELexicalCategory), required: false },
      },
    ], // Переводы
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
      ret.translations = (ret.translations as WordTranslationDbDto[]).map((translation) => {
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

export const WordModel: WordModel = model<WordDbDto, WordModel>(EDbModels.Word, wordSchema);
