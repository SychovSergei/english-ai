import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

export class Translation {
  constructor(
    public readonly language: ELangs,
    public readonly text: string,

    public readonly difficultyLevel: ELevels,
    public readonly lexicalCategory: ELexicalCategory,
    public readonly description?: string,
  ) {
    if (!text || text.length === 0) {
      throw new Error('Translation text is required');
    }
  }
}
