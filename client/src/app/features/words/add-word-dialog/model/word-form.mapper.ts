import { Word } from '@entities/word';
import { WordFormValue } from '@features/words/add-word-dialog/model/word-form.types';

export function mapWordToFormValue(word: Word): WordFormValue {
  return {
    id: word.id,
    text: word.text,
    language: word.language,
    translations: word.translations.map((tr) => ({
      id: tr.id,
      translText: tr.text,
      language: tr.language,
      description: tr.description,
      lexicalCategory: tr.lexicalCategory,
      difficultyLevel: tr.difficultyLevel,
    })),
  };
}
