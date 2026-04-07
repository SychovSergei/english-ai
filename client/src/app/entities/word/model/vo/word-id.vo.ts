import { EntityId } from '@entities/word/model/entity-id';

export class WordId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static from(value: string): WordId {
    return new WordId(value);
  }

  static generate(generator: () => string): WordId {
    return new WordId(generator());
  }
}
