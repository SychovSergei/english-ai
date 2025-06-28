import { Model, model, Schema } from 'mongoose';

import { WordTranslation } from '@core/domain/entities';
import { ELevels, ELexicalCategory } from '@core/domain/enums';
import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

/**
 * A Mongoose model type for word translations.
 * This model is used to interact with word translation documents in the database.
 * It is based on the `WordTranslation` domain entity, which contains
 * translation text, language, lexical category, and difficulty level.
 *
 * @typedef {Model<WordTranslation>} WordTranslationModel
 */
type WordTranslationModel = Model<WordTranslation>;

/**
 * Schema for word translations.
 *
 * Defines the structure of a word translation document, including fields such as:
 * - text (the translated text)
 * - language (the language of the translation)
 * - lexicalCategory (category like noun, verb, etc.)
 * - difficultyLevel (A1, B2, etc.)
 */
const wordTranslationSchema: Schema = new Schema<WordTranslation, WordTranslationModel>({
  text: { type: String, required: true }, // Translation text
  language: { type: String, required: true }, // Translation language
  description: { type: String, required: false }, // Description of translation
  lexicalCategory: { type: String, enum: Object.values(ELexicalCategory) }, // Lexical category
  difficultyLevel: { type: String, enum: Object.values(ELevels) }, // Difficulty level (A1, B2, etc.)
});

/**
 * Mongoose model for storing word translations in the database.
 *
 * This model is based on the `WordTranslation` schema and supports
 * properties such as translation text (`text`), language (`language`),
 * lexical category (`lexicalCategory`), and difficulty level (`difficultyLevel`).
 *
 * @type {WordTranslationModel}
 * @see WordTranslation
 */
export const TranslationModel: WordTranslationModel = model<WordTranslation, WordTranslationModel>(
  EDbModels.Translation,
  wordTranslationSchema,
);
