import { Model, model, Schema } from 'mongoose';

import { WordSetDbDto, WordSetSettingsDbDto } from '@core/domain/entities/word-set/types/word-set-db.dto';
import { ELangs, EWordSetVisibility } from '@core/domain/enums';
import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

type WordSetModel = Model<WordSetDbDto>;

const wordSetSettingsSchema = new Schema<WordSetSettingsDbDto>(
  {
    passwordHash: { type: String, required: false },
    visibility: {
      type: String,
      enum: Object.values(EWordSetVisibility),
      default: EWordSetVisibility.Private,
    },
    language: { type: String, enum: Object.values(ELangs), default: ELangs.EN },
    allowCopy: { type: Boolean, required: true },
  },
  { _id: false },
);

// settings: wordSetSettingsSchema,
//
//   words: z.array(z.string()).default([]),

const wordSetSchema: Schema = new Schema<WordSetDbDto, WordSetModel>({
  title: { type: String, required: true }, // Название набора слов
  description: { type: String }, // Описание набора слов
  ownerId: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Владелец набора слов
  settings: wordSetSettingsSchema,

  words: [{ type: Schema.Types.ObjectId, ref: EDbModels.Word }], // Слова, входящие в набор

  createdAt: { type: Date, default: Date.now }, // Дата создания набора
  // sharedWith: [{ type: Schema.Types.ObjectId, ref: EDbModels.User }], // Пользователи, с которыми набор слов поделился
});

wordSetSchema.set('toObject', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const WordSetModel: WordSetModel = model<WordSetDbDto, WordSetModel>(EDbModels.WordSet, wordSetSchema);
