import { ELangs, ELevels, ELexicalCategory } from '@shared/enums';
import { HasId } from '@shared/interfaces';

export interface Word extends HasId {
  // id?: string; // Идентификатор слова

  owner: string; // Идентификатор пользователя
  // isPublic: boolean; // Общедоступность
  text: string; // Оригинальный текст слова
  language: ELangs; // Язык оригинала
  image?: string;
  // relatedForms: string[]; // Производные формы слова (e.g., runs, running).
  translations: WordTranslation[]; // Массив переводов
  // sentences: string[]; // Предложения, в которых это слово встречается (язык оригинала) // TODO ???
  // createdAt: Date; // Дата создания слова
}

export type ISortDirection = 'asc' | 'desc' | '';

export interface ISortTable {
  /** The id of the column being sorted. */
  active: string;
  /** The sort direction. */
  direction: ISortDirection;
}

export interface WordsRequest {
  //TODO это может бфть сделать универсальным для запросов таблицы???
  offset: number; // for pagination - (page*limit)
  limit: number; // amount words view
  filter: string;
  sortName: ISortTable['active'];
  sortDirection: ISortTable['direction'];
}

// Интерфейс для списка слов
export interface WordsResponse {
  data: Word[]; // Word[];
  total: number; // common amount words
}

//***************************

// export type WordIdResponse = Required<Pick<Word, 'id'>>;
export interface WordIdResponse {
  id: string | null;
}

export type CreateWordDTO = Pick<Word, 'text' | 'language' | 'translations'>;
export type UpdateWordDTO = Pick<Word, 'id' | 'text' | 'translations'>;
//   & {
//   translations: WordTranslation[];
// };

// Интерфейс для редактирования слова (например, через PATCH)
export interface IWordTranslationDTO {
  id: string;
  text: string;
  language: ELangs;
  description: string;
  difficultyLevel: ELevels; // Уровень сложности
  lexicalCategory: ELexicalCategory; // lexical categories (Noun, Verb)
}

export interface DeleteWordRequest {
  wordId: string;
}
export interface DeleteWordResponse {
  success: boolean;
  message: string;
}

export type WordTranslation = {
  id: string;
  text: string;
  language?: ELangs;
  description?: string;
  difficultyLevel?: ELevels; // Уровень сложности
  lexicalCategory?: ELexicalCategory; // lexical categories (Noun, Verb)
};

// TODO разобраться в интерфейсах - нужны ли они?
