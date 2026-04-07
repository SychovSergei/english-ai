import {
  CreateWordPayload,
  UpdateWordPayload,
  WordDto,
  WordMetadata,
  WordTranslationDto,
} from '@entities/word/api/word.dto';
import { ImageAssociation, WordId, WordTranslation, WordValue } from '@entities/word/model/vo';
import { ELangs } from '@shared/enums';
import { OwnerId } from '@shared/lib/auth/owner-id.vo';
import { EntityBase } from '@shared/lib/domain/entity.base';
import { generateCompactId } from '@shared/lib';

export interface WordEntityProps {
  readonly value: WordValue;
  readonly ownerId: OwnerId;
  readonly language: ELangs;
  readonly sense: string | null;
  readonly translations: WordTranslation[];
  readonly isPublic: boolean;
  readonly image: ImageAssociation | null;
  readonly metadata: WordMetadata;
  readonly updatedAt: number;
}

export class WordEntity extends EntityBase<WordId, WordEntityProps> {
  private constructor(id: WordId, props: WordEntityProps) {
    super(id, props);
  }

  get value(): WordValue {
    return this.props.value;
  }
  get ownerId(): OwnerId {
    return this.props.ownerId;
  }
  get language(): ELangs {
    return this.props.language;
  }
  get translations(): WordTranslation[] {
    return this.props.translations;
  }
  get isPublic(): boolean {
    return this.props.isPublic;
  }
  get image(): ImageAssociation | null {
    return this.props.image;
  }
  get metadata(): WordMetadata {
    return this.props.metadata;
  }

  /**
   * CREATE: Используем для создания НОВЫХ слов (из формы)
   */
  static create(data: CreateWordPayload, currentOwner: OwnerId): WordEntity {
    // TODO: generateId maybe should be in utils???
    const wordId = WordId.generate();

    if (data.translations.length === 0) {
      throw new Error('Word must have at least one translation');
    }

    const props: WordEntityProps = {
      value: WordValue.create(data.value, data.language as ELangs),
      ownerId: currentOwner, // Передаем владельца из фасада
      language: data.language as ELangs,
      sense: data.sense,
      translations: data.translations.map((t) => WordTranslation.create({ ...t, id: generateCompactId() })),
      //WordTranslation.create({ ...t, id: generateId() })),
      isPublic: data.isPublic,
      image: data.image ? new ImageAssociation(data.image.url, data.image.description) : null,
      metadata: {
        synced: false, // при создании слова по умолчанию не синхронизировано
        isDeleted: false, // при создании слова по умолчанию не удалено
      },
      updatedAt: Date.now(),
    };

    return new WordEntity(wordId, props);
  }

  /**
   * RESTORE: Восстановление из БД (DTO -> Entity)
   */
  // { synced: boolean; isDeleted?: boolean }
  static restore(data: WordDto & { metadata: WordMetadata }): WordEntity {
    // console.log('WordEntity static restore data', data);
    // if (data.value === undefined) this.loggerService.log('>>>>>> WordEntity restore data = ', data);
    // if (data.value === undefined) this.loggerService.log('>> ID >>>> WordEntity restore data = ', data.id, 'VALUE', data.value);
    const props: WordEntityProps = {
      value: WordValue.create(data.value, data.language as ELangs),
      ownerId: OwnerId.from(data.ownerId),
      language: data.language as ELangs,
      sense: data.sense,
      translations: data.translations.map(WordTranslation.restore),
      isPublic: data.isPublic,
      image: data.image ? new ImageAssociation(data.image.url, data.image.description) : null,
      metadata: {
        synced: data.metadata.synced,
        isDeleted: data.metadata.isDeleted,
      },
      updatedAt: data.updatedAt ?? Date.now(),
    };

    return new WordEntity(WordId.from(data.id), props);
  }

  /**
   * UPDATE: Возвращает новую копию с изменениями
   */
  public update(
    payload: UpdateWordPayload,
    options: { hasDependencies: boolean } = { hasDependencies: false },
  ): WordEntity {
    const isValueChanged = payload.value !== this.value.value;

    if (isValueChanged && options.hasDependencies) {
      throw new Error('Cannot change word value: it is used in sentences. Create a new word instead.');
    }

    // Валидация новых данных перед созданием
    if (payload.translations.length === 0) throw new Error('Need at least one translation');

    // const updatedTranslations = payload.translations.map((p) => {
    //   const existing = this.props.translations.find((t) => t.id.value === p.id);
    //
    //   if (existing) {
    //     // Обновляем существующий
    //     return WordTranslation.create({ ...p, id: existing.id.value });
    //   }
    //
    //   // Создаем новый (id сгенерируется внутри WordTranslation.create)
    //   return WordTranslation.create(p);
    // });

    const newProps: WordEntityProps = {
      ...this.props,
      // value: payload.value ? WordValue.create(payload.value, this.props.language) : this.props.value,
      value: WordValue.create(payload.value, this.props.language),
      sense: payload.sense, // !== undefined ? payload.sense : this.props.sense,
      isPublic: payload.isPublic, // !== undefined ? payload.isPublic : this.props.isPublic,
      // Логика обновления переводов (можно вынести в WordPropsHelper)
      translations: this.syncTranslations(payload.translations),
      image: payload.image,
      metadata: {
        synced: false,
        isDeleted: false,
      },
      updatedAt: Date.now(),
    };

    // Возвращаем новую версию сущности (Immutability)
    return new WordEntity(this.id, newProps);
  }

  private syncTranslations(payloadTranslations?: WordTranslationDto[]): WordTranslation[] {
    if (!payloadTranslations) return this.props.translations;
    // ... логика сопоставления ID ...

    return payloadTranslations.map((p) => {
      const existing = this.props.translations.find((t) => t.id.value === p.id);

      // если перевода нет, то создаем новый (id сгенерируется внутри WordTranslation.create)
      if (!existing) return WordTranslation.create(p);

      // если перевод есть, то сохраняем "личность" (старый ID),
      // но обновляем данные
      return WordTranslation.create({
        ...p,
        id: existing.id.value, // Гарантия, что ID не изменится
      });
    });
  }
}
