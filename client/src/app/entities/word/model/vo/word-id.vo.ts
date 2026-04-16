import { generateCompactId } from '@shared/lib';
import { EntityId } from '@shared/model/entity-id';

export class WordId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static from(value: string): WordId {
    return new WordId(value);
  }

  static generate(generator: () => string = generateCompactId): WordId {
    return new WordId(generator());
  }
}
