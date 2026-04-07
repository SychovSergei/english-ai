import { EntityId } from '@entities/word/model/entity-id';

export class WordSetId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static from(value: string): WordSetId {
    return new WordSetId(value);
  }

  static generate(generator: () => string): WordSetId {
    return new WordSetId(generator());
  }
}
