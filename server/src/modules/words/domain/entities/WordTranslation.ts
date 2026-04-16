import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { CreateWordTranslationsProps } from '@modules/words/domain/contracts/CreateWordTranslationProps';
import { UpdateTranslationData } from '@modules/words/domain/contracts/UpdateTranslationData';
import { TranslationId } from '@modules/words/domain/value-objects/TranslationId';

export class WordTranslation {
  private constructor(
    public readonly id: TranslationId,
    public value: string,
    public language: ELangs,

    public description?: string,
    public difficultyLevel?: ELevels,
    public lexicalCategory?: ELexicalCategory,
  ) {
    if (!value || value.length === 0) {
      throw new Error('Translation text is required');
    }
  }

  static create(props: CreateWordTranslationsProps): WordTranslation {
    // console.log('create(props ----', props);
    if (!props.value.trim()) {
      throw new Error('Translation text cannot be empty');
    }

    return new WordTranslation(
      props.id,
      props.value,
      props.language,
      props.description,
      props.difficultyLevel,
      props.lexicalCategory,
    );
  }

  update(data: UpdateTranslationData): void {
    if (data.value) this.value = data.value;
    if (data.language) this.language = data.language;
    if (data.difficultyLevel) this.difficultyLevel = data.difficultyLevel;
    if (data.lexicalCategory) this.lexicalCategory = data.lexicalCategory;
    if (data.description) this.description = data.description;
  }

  updateText(text: string): void {
    if (!text || text.length === 0) {
      throw new Error('Translation text value cannot be empty');
    }
    this.value = text;
  }

  clearDescription(): void {
    this.description = undefined;
  }
}
