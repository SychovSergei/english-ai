import { AggregateRoot } from '@core/domain/base/AggregateRoot';
import { ELangs } from '@core/domain/enums';
import { AppValidationError } from '@core/domain/errors';
import { OwnerId } from '@core/domain/identity/OwnerId';
import { CreateWordProps } from '@modules/words/domain/contracts/CreateWordProps';
import { UpdateTranslationData } from '@modules/words/domain/contracts/UpdateTranslationData';
import { WordTranslation } from '@modules/words/domain/entities';
import { WordCreatedEvent } from '@modules/words/domain/events/WordCreatedEvent';
import { WordTranslationAddedEvent } from '@modules/words/domain/events/WordTranslationAddedEvent';
import { WordTranslationUpdatedEvent } from '@modules/words/domain/events/WordTranslationUpdatedEvent';
import { ImageAssociation, TranslationId } from '@modules/words/domain/value-objects';
import { WordId } from '@modules/words/domain/value-objects/WordId';
import { WordTranslationError } from '@modules/words/domain/errors';

// Что Сущность готова принять для изменения.
// Могут включать Доменные объекты (например, Translation[] или ValueObjects).
// Не содержит id, так как объект уже найден и мы вызываем метод на нём.
export interface UpdateWordData {
  value?: string;
  sense?: string | null;
  translations?: WordTranslation[]; // Domain Objects
  image?: ImageAssociation | null;
  isPublic?: boolean;
}

export class Word extends AggregateRoot<WordId> {
  private constructor(
    public readonly id: WordId,
    public value: string,
    public readonly owner: OwnerId,

    public readonly language: ELangs,
    public sense: string | null,
    public translations: WordTranslation[],
    public isPublic: boolean,
    public image: ImageAssociation | null,

    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id);
  }

  static create(props: CreateWordProps): Word {
    const translations = props.translations.map((t) =>
      WordTranslation.create({
        id: t.id,
        value: t.value,
        language: t.language,
        description: t.description,
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      }),
    );

    const word = new Word(
      props.id,
      props.value,
      props.owner,
      props.language,
      props.sense,
      translations,
      props.isPublic,
      props.image,
      new Date(), // createdAt
      new Date(), // updatedAt
    );

    word.addDomainEvent(new WordCreatedEvent({ wordId: props.id.value, value: props.value, owner: props.owner }));

    return word;
  }

  public update(data: UpdateWordData): void {
    // 1. Валидация значения (если оно меняется)
    if (data.value !== undefined) {
      if (!data.value.trim()) throw AppValidationError.singleField('word', 'value', 'Word value is required');
      this.value = data.value.trim();
    }

    // 2. Обновление смысла
    if (data.sense !== undefined) this.sense = data.sense;
    if (data.isPublic !== undefined) this.isPublic = data.isPublic;
    if (data.image !== undefined) this.image = data.image;

    // 3. Обновление переводов
    if (data.translations !== undefined) {
      if (data.translations.length === 0) {
        throw AppValidationError.singleField('word', 'translations', 'At least one translation is required');
      }
      // TODO В DDD обычно мы либо заменяем коллекцию целиком,
      //  либо вызываем методы add/remove/update. Для простоты здесь - замена.
      this.translations = data.translations;
    }

    // 5. Фиксируем дату обновления (опционально)
    this.updatedAt = new Date();
  }

  addTranslation(translation: WordTranslation): void {
    //TODO надо ли?
    this.translations.push(translation);

    this.addDomainEvent(
      new WordTranslationAddedEvent({
        wordId: this.id.value,
        translationId: translation.id.value,
      }),
    );
  }

  updateTranslation(translationId: TranslationId, data: UpdateTranslationData): void {
    const translation = this.getTranslation(translationId);
    translation.update(data);

    this.addDomainEvent(
      new WordTranslationUpdatedEvent({
        wordId: this.id.value,
        translationId: translationId,
      }),
    );
  }

  getTranslation(translationId: TranslationId): WordTranslation {
    const translation = this.translations.find((translation) => translation.id.equals(translationId));
    if (!translation) {
      throw WordTranslationError.NotFound(translation);
    }

    return translation;
  }

  // setImage(image: ImageAssociation): void {
  //   this.image = image;
  // }
}
