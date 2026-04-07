import { WordDto } from '@entities/word';
import { WordFormValue } from '@features/words';
import { ELevels, ELexicalCategory } from '@shared/enums';

// export function mapWordToFormValue(word: WordEntity): WordFormValue {
//   return {
//     id: word.id.value,
//     value: word.value.value,
//     language: word.language,
//     translations: word.translations.map((tr) => ({
//       id: tr.id.value,
//       translText: tr.value,
//       language: tr.language,
//       description: tr.description,
//       lexicalCategory: tr.lexicalCategory,
//       difficultyLevel: tr.difficultyLevel,
//     })),
//   };
// }

export class WordFormMapper {
  static toForm(dto: WordDto): WordFormValue {
    return {
      id: dto.id,
      value: dto.value,
      language: dto.language,
      translations: dto.translations.map((tr) => ({
        id: tr.id,
        translText: tr.value, // мапим value -> translText
        language: tr.language,
        description: tr.description,
        lexicalCategory: tr.lexicalCategory as ELexicalCategory,
        difficultyLevel: tr.difficultyLevel as ELevels,
      })),
    };
  }
}
