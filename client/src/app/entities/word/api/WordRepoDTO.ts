import { IWordTranslationDTO, WordsResponse, WordTranslation } from '@entities/word/model/word.model';
import { ELangs, ELevels, ELexicalCategory } from '@shared/enums';

export class WordTranslationItemDTO implements WordTranslation {
  id: string;
  text: string;
  description: string;
  difficultyLevel: ELevels;
  language: ELangs;
  lexicalCategory: ELexicalCategory;

  constructor(data?: Partial<IWordTranslationDTO>) {
    this.id = data?.id ?? '';
    this.text = data?.text ?? '';
    this.description = data?.description ?? '';
    this.difficultyLevel = data?.difficultyLevel ?? ELevels.Empty;
    this.language = data?.language ?? ELangs.UA; //TODO взять из настроек пользователя??
    this.lexicalCategory = data?.lexicalCategory ?? ELexicalCategory.Empty;
  }
}

export class WordItemDTO {
  id: string;
  text: string;
  translations: WordTranslation[];

  constructor(data: Partial<WordItemDTO>) {
    this.id = data.id ?? '';
    this.text = data.text ?? '';
    this.translations = Array.isArray(data.translations)
      ? data.translations.map((translation) => new WordTranslationItemDTO(translation))
      : [];
  }
}

export class WordsResponseDTO {
  words: WordItemDTO[];
  total: number;

  constructor(data: Partial<WordsResponse>) {
    this.words = Array.isArray(data?.data) ? data.data.map((word) => new WordItemDTO(word)) : [];
    this.total = data.total || 0;
  }
}
