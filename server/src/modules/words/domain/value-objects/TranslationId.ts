import { EntityId } from '@core/domain/common';

export class TranslationId extends EntityId {
  private constructor(public readonly value: string) {
    super(value);
  }

  // static generate(): TranslationId {
  static generate(generator: () => string): TranslationId {
    // return new TranslationId(EntityId.newId());
    return new TranslationId(generator());
  }

  static from(value: string): TranslationId {
    return new TranslationId(value);
  }
}
