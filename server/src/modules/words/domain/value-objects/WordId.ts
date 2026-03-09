import { EntityId } from '@core/domain/common';

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
