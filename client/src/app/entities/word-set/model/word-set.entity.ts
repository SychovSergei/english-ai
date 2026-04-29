import { WordId, WordMetadata } from '@entities/word/@x/word-set';
import { CreateWordSetPayload, UpdateWordSetPayload, WordSetDto } from '@entities/word-set/api';
import { WordSetId, WordSetProps, WordSetSettings } from '@entities/word-set/model';
import { OwnerId } from '@shared/lib/auth/owner-id.vo';
import { EntityBase } from '@shared/lib/domain/entity.base';

export class WordSet extends EntityBase<WordSetId, WordSetProps> {
  private constructor(id: WordSetId, props: WordSetProps) {
    super(id, props);
  }

  // Геттеры для удобства
  get title(): string {
    return this.props.title;
  }
  get wordIds(): WordId[] {
    return this.props.wordIds;
  }
  get description(): string | undefined {
    return this.props.description;
  }
  get settings(): WordSetSettings {
    return this.props.settings;
  }

  /**
   * CREATE: Новая сущность из UI
   */
  static create(payload: CreateWordSetPayload, currentOwner: OwnerId): WordSet {
    const id = WordSetId.generate(); //WordSetId.generate(generateId);

    const wordSetProps: WordSetProps = {
      title: payload.title,
      description: payload.description || '',
      ownerId: currentOwner,
      wordIds: (payload.wordIds || []).map((id) => WordId.from(id)),
      // settings: new WordSetSettings(EWordSetVisibility.PRIVATE, ELangs.EN, false),
      settings: WordSetSettings.create(payload.settings),
      metadata: {
        synced: false,
        isDeleted: false,
      },
      updatedAt: Date.now(),
    };

    return new WordSet(id, wordSetProps);
  }

  /**
   * REHYDRATION: Восстановление из БД
   */
  static restore(dto: WordSetDto & { metadata: WordMetadata }, currentOwner: OwnerId): WordSet {
    const props: WordSetProps = {
      title: dto.title,
      description: dto.description,
      ownerId: OwnerId.fromRaw({ kind: currentOwner.kind, id: currentOwner.id, role: currentOwner.role }),
      wordIds: dto.wordIds.map((id) => WordId.from(id)),
      settings: WordSetSettings.restore(dto.settings),
      metadata: {
        synced: dto.metadata.synced,
        isDeleted: dto.metadata.isDeleted,
      },
      updatedAt: dto.updatedAt ?? Date.now(),
    };

    return new WordSet(WordSetId.from(dto.id), props);
  }

  /**
   * UPDATE: Иммутабельное обновление
   */
  update(payload: UpdateWordSetPayload): WordSet {
    const newProps: WordSetProps = {
      ...this.props,
      title: payload.title,
      description: payload.description,
      wordIds: payload.wordIds.map((id) => WordId.from(id)),
      settings: WordSetSettings.create(payload.settings),
      metadata: {
        synced: false, // При любом изменении сбрасываем флаг синхронизации
        isDeleted: false,
      },
      updatedAt: Date.now(),
    };

    return new WordSet(this.id, newProps);
  }

  /**
   * DOMAIN LOGIC: Иммутабельное добавление слов
   * */
  public addWord(wordId: WordId): WordSet {
    if (this.props.wordIds.some((id) => id.equals(wordId))) return this;

    return new WordSet(this.id, {
      ...this.props,
      wordIds: [...this.props.wordIds, wordId],
      metadata: { ...this.props.metadata, synced: false },
      updatedAt: Date.now(),
    });
  }

  /**
   *   DOMAIN LOGIC: Иммутабельное изменение названия
   *  */
  public rename(newTitle: string): WordSet {
    return new WordSet(this.id, {
      ...this.props,
      title: newTitle,
      metadata: { ...this.props.metadata, synced: false },
      updatedAt: Date.now(),
    });
  }
}
