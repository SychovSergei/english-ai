import { UpdateWordTranslationPayload, WordTranslationPayload } from '@entities/word';
import { ELangs, ELevels, ELexicalCategory } from '@shared/enums';
import { generateCompactId } from '@shared/lib';
import { EntityId } from '@shared/model/entity-id';

export class WordTranslation {
  private constructor(
    public readonly id: TranslationId,
    public readonly value: string,
    public readonly language: ELangs,
    public readonly description?: string,
    public readonly difficultyLevel?: ELevels,
    public readonly lexicalCategory?: ELexicalCategory,
  ) {}

  static create(dto: WordTranslationPayload): WordTranslation {
    return new WordTranslation(
      dto.id ? TranslationId.from(dto.id) : TranslationId.generate(generateCompactId),

      dto.value,
      dto.language as ELangs, // TODO How to recognise language ELangs enum ???
      dto.description,
      dto.difficultyLevel as ELevels,
      dto.lexicalCategory as ELexicalCategory,
    );
  }

  static restore(data: UpdateWordTranslationPayload): WordTranslation {
    return new WordTranslation(
      TranslationId.from(data.id),
      data.value,
      data.language as ELangs,
      data.description,
      data.difficultyLevel ? (data.difficultyLevel as ELevels) : ELevels.Empty,
      data.lexicalCategory ? (data.lexicalCategory as ELexicalCategory) : ELexicalCategory.Empty,
    );
  }
}

export class TranslationId extends EntityId {
  private constructor(public override value: string) {
    super(value);
  }

  static generate(generator: () => string): TranslationId {
    return new TranslationId(generator());
  }

  static from(value: string): TranslationId {
    return new TranslationId(value);
  }
}
