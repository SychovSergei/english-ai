import { EntityId } from '@core/domain/common';

export class UserId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static generate(generator: () => string): UserId {
    return new UserId(generator());
  }

  static from(value: string): UserId {
    if (!value) throw new Error('UserId cannot be empty');
    return new UserId(value);
  }
}
