import { Word } from '@entities/word';
import { WordItem, WordItemIsNew } from '@entities/word-set/models';
import { ELangs } from '@shared/enums';
import { generateUuid } from '@shared/utils';

/**
 * Преобразует массив слов из API (`Word[]`) в форму для редактирования (`WordItemIsNew[]`).
 *
 * @param words - Список слов, полученных с сервера
 * @returns Массив слов для формы, с флагом `isNew: false`
 */
export function mapWordsFromServerToForm(words: Word[]): WordItemIsNew[] {
  return words.map((word) => ({
    id: word.id,
    term: word.text,
    definition: word.translations[0]?.text || '',
    isNew: false, // words from server are only - false
  }));
}

/**
 * Преобразует данные формы (`WordItem[]`) в формат для отправки на сервер (`Word[]`).
 *
 * @param items - Слова из формы
 * @param owner - Идентификатор владельца (создателя)
 * @param lang - Язык слов
 * @returns Массив слов в формате API
 */
export function mapWordsFromFormToServer(items: WordItem[], owner: string, lang: ELangs): Word[] {
  return items.map((item) => ({
    id: item.id ?? '',
    owner,
    language: lang,
    text: item.term,
    translations: [
      {
        id: generateUuid(), // или item.definitionId если есть
        text: item.definition,
      },
    ],
  }));
}

/**
 * Мапперы преобразования слов из/в форму.
 */
export const wordFormMapper = {
  fromServerToForm: mapWordsFromServerToForm,
  fromFormToServer: mapWordsFromFormToServer,
};
