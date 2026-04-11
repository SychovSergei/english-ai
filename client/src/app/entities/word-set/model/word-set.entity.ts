import { WordId, WordMetadata } from '@entities/word/@x/word-set';
import { CreateWordSetPayload, UpdateWordSetPayload, WordSetDto } from '@entities/word-set/api';
import { WordSetId, WordSetSettings } from '@entities/word-set/model/vo';
import { OwnerId } from '@shared/lib/auth/owner-id.vo';
import { EntityBase } from '@shared/lib/domain/entity.base';

export interface WordSetProps {
  readonly ownerId: OwnerId;
  readonly title: string;
  readonly wordIds: WordId[]; // Ссылки по ID
  readonly settings: WordSetSettings; // VO
  readonly description?: string;
  readonly metadata: WordMetadata; // Сеты тоже нужно синхронизировать!
  readonly updatedAt: number;
}

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
      ownerId: currentOwner,
      title: payload.title,
      description: payload.description,
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
   * RESTORE: Восстановление из локальной базы или API
   */
  static restore(data: WordSetDto & { metadata: WordMetadata }, currentOwner: OwnerId): WordSet {
    const props: WordSetProps = {
      ownerId: OwnerId.fromRaw({ kind: currentOwner.kind, id: currentOwner.id, role: currentOwner.role }),
      title: data.title,
      description: data.description,
      wordIds: data.wordIds.map((id) => WordId.from(id)),
      settings: WordSetSettings.restore(data.settings),
      metadata: {
        synced: data.metadata.synced,
        isDeleted: data.metadata.isDeleted,
      },
      updatedAt: data.updatedAt ?? Date.now(),
    };

    return new WordSet(WordSetId.from(data.id), props);
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
}
