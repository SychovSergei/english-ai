// import { IWordTranslation } from './word-translation.interface';
import { ELangs } from '@shared/enums/langs.enum';
import { ELevels } from '@shared/enums/levels.enum';
import {
  SharedCreateWordDTO,
  SharedGetWordsResponse,
  SharedUpdateWordDTO,
  SharedWord,
  SharedWordTranslation,
} from '@shared/interfaces/word.interface';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Word extends SharedWord {}

// Интерфейс для ответа сервера с полными данными слова
export type WordResponseDTO = Word; //TODO тут наверно нужно вместе с ID передавать

// export type WordIdResponse = Required<Pick<Word, 'id'>>;
export interface WordIdResponse {
  id: string;
}

// Общий интерфейс для создания слова (без полей, генерируемых автоматически)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateWordDTO extends SharedCreateWordDTO {} //Omit<SharedWord, 'owner' | 'createdAt'>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WordTranslation extends SharedWordTranslation {}
export type CreateWordResponse = Word;

// Интерфейс для редактирования слова (например, через PATCH)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateWordDTO extends SharedUpdateWordDTO {} //= Partial<Omit<Word, 'owner' | 'createdAt'>>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateWordResponse extends Word {}

export interface DeleteWordRequest {
  wordId: string;
}
export interface DeleteWordResponse {
  success: boolean;
  message: string;
}

export interface GetWordsRequest {
  owner?: string;
  isPublic?: boolean;
  language?: ELangs;
  difficultyLevel?: ELevels;
  page?: number; // Для пагинации
  limit?: number; // Количество записей на страницу
}

// Интерфейс для списка слов
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetWordsResponse extends SharedGetWordsResponse {
  // data: SharedWord[];
  // total: number; // Общее количество слов
  // success: boolean;
  // page: number;
  // limit: number;
}
