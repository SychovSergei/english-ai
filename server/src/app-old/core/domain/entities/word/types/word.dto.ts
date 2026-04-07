import { Word, WordTranslation } from '@core/domain/entities';
import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
// import { WordTranslationError } from '@core/domain/errors/WordTranslationError';

export type CreateWordDto = Pick<Word, 'text' | 'language' | 'relatedForms' | 'sentences'> & {
  translations: WordCreateTranslation[];
};

type WordCreateTranslation = {
  // id?: string;
  text: string;
  language: ELangs;
  description?: string;
  difficultyLevel: ELevels;
  lexicalCategory: ELexicalCategory;
};

/** Word Update Request */
export type UpdateWordDto = Pick<Word, 'id' | 'text' | 'language'> & {
  translations: WordUpdateTranslationDTO;
};

export type WordUpdateTranslationDTO = {
  created: WordTranslationCreated[];
  updated: WordTranslationUpdated[];
  deleted: WordTranslationDeleted[];
};

export type WordTranslationCreated = Omit<WordTranslation, 'id'>;
export type WordTranslationUpdated = Partial<Omit<WordTranslation, 'id'>> & Required<Pick<WordTranslation, 'id'>>;
export type WordTranslationDeleted = Pick<Required<WordTranslation>, 'id'>;

// TODO Am I using this? !!!!!
/** Word Update Response */
export type WordUpdateOperationResult = WordUpdateBaseOperationResult & WordUpdateTranslationOperationResult;
export type WordUpdateBaseOperationResult = Pick<Word, 'id' | 'text' | 'language'>;
export type WordUpdateTranslationOperationResult = {
  translations: {
    created: OperationResult<WordTranslationDto | null>[];
    updated: OperationResult<WordTranslationDto | null, WordTranslationError>[];
    deleted: OperationResult<string | null, WordTranslationError>[];
    skipped: OperationResult<null, WordTranslationError>[]; // 💡 новый блок
  };
};

type OperationResult<T, TError = unknown> = OperationSuccess<T> | OperationError<TError>;
//   {
//   id: string | number;
//   status: 'success' | 'error';
//   value: T | null;
//   reason: any | null;
// };
type OperationSuccess<T> = {
  id: string | number;
  status: 'success';
  value: T;
  reason: null;
};
type OperationError<TError> = {
  id: string | number;
  status: 'error';
  value: null;
  reason: TError;
};

export type WordTranslationDto = {
  id: string;
  text: string;
  language: ELangs;
  description?: string;
  difficultyLevel: ELevels;
  lexicalCategory: ELexicalCategory;
};
