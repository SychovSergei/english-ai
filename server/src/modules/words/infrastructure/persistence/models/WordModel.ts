import { HydratedDocument, Model, model, Schema } from 'mongoose';

import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

import { WordPersistence, WordTranslationPersistence } from '@modules/words/infrastructure/db/mongoose/Word.schema';

export type WordDocument = HydratedDocument<WordPersistence>;
export const WORD_MODEL_NAME = 'Word';

export type WordModel = Model<WordPersistence>;

/* ---------- Translation schema ---------- */
const WordTranslationSchema = new Schema<WordTranslationPersistence>(
  {
    _id: { type: String, required: true },
    value: { type: String, required: true },
    language: { type: String, enum: Object.values(ELangs), required: true },
    description: { type: String },
    difficultyLevel: { type: String, enum: Object.values(ELevels) },
    lexicalCategory: { type: String, enum: Object.values(ELexicalCategory) },
  },
  { _id: false, timestamps: true },
);

/* ---------- Word schema ---------- */
const WordSchema = new Schema<WordPersistence>(
  {
    _id: { type: String, required: true },

    value: { type: String, required: true }, // Текст слова
    sense: { type: String, default: null },

    ownerId: { type: String, required: true }, // Владелец слова.
    ownerKind: { type: String, enum: ['user', 'guest'], required: true }, // тип владельца.

    language: { type: String, enum: Object.values(ELangs), required: true },

    translations: { type: [WordTranslationSchema], default: [] }, // Переводы
    isPublic: { type: Boolean, default: false }, // Общедоступность

    // sentences: [{ type: Schema.Types.ObjectId, ref: 'Sentence' }], // Предложения, в которых это слово встречается
    // relatedForms: [{ type: String, required: true }], // Производные формы слова (e.g., runs, running).

    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { _id: false, timestamps: true },
);

// Определение составного индекса на уровне схемы
WordSchema.index({ value: 1, ownerId: 1, sense: 1 }, { unique: true });

export const WordModel = model<WordPersistence>(WORD_MODEL_NAME, WordSchema);
