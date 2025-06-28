import { Types } from 'mongoose'; // TODO !!!!!!! CORE слой не должен зависеть от mongoose!!!!!

import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

// type CustomObjectId = Types.ObjectId; // TODO надо ли?

/**
 * Represents a word entity stored in the database.
 * Used for database operations via Mongoose.
 */
export interface WordDbDto {
  /**
   * The unique identifier of the word.
   * If not provided, Mongoose will generate it automatically.
   */
  _id?: Types.ObjectId;

  /**
   * The ID of the user who owns this word.
   */
  owner: Types.ObjectId;

  /**
   * The main text of the word.
   */
  text: string;

  /**
   * The language of the word.
   * Must be one of the values defined in the ELangs enum.
   */
  language: ELangs;

  /**
   * A list of translations for this word.
   */
  translations: WordTranslationDbDto[];

  /**
   * Whether the word is visible to other users.
   */
  isPublic: boolean;

  /**
   * Related word forms (e.g., conjugations, declensions).
   */
  relatedForms: string[];

  /**
   * A list of sentence IDs where this word is used.
   */
  sentences: Types.ObjectId[];

  /**
   * The date when the word was created.
   * Automatically set by Mongoose.
   */
  createdAt?: Date;

  /**
   * The date when the word was last updated.
   * Automatically updated by Mongoose.
   */
  updatedAt?: Date;
}

/**
 * Represents a translation of a word in a specific language.
 */
export interface WordTranslationDbDto {
  /**
   * Optional unique identifier for the translation.
   * Usually generated automatically by Mongoose.
   */
  _id?: Types.ObjectId;

  /**
   * The translated text.
   */
  text: string;

  /**
   * The language of the translation.
   * Should be one of the values defined in the ELangs enum.
   */
  language: ELangs;

  /**
   * An optional description for the translation of note about the translation.
   */
  description?: string;

  /**
   * The difficulty level of the translation.
   */
  difficultyLevel: ELevels;

  /**
   * The lexical category (e.g., noun, verb, adjective).
   * Defined by the ELexicalCategory enum.
   */
  lexicalCategory: ELexicalCategory;
}
