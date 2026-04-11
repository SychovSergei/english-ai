import { generateCompactId } from '@shared/lib';
import { EntityId } from '@shared/model/entity-id';

export class UserId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static from(value: string): UserId {
    return new UserId(value);
  }

  static generate(generator: () => string = generateCompactId): UserId {
    return new UserId(generator());
  }
}
