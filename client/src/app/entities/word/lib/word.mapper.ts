import { WordDto } from '@entities/word/api';
import { WordEntity } from '@entities/word/model/word.entity';
import { OfflineEntry } from '@shared/api/offline/offline-storage.service';
import { OwnerId } from '@shared/lib/auth/owner-id.vo';

export class WordMapper {
  // Из API во Фронтенд (Domain)
  /**
   * Из DTO в Сущность (восстановление данных)
   */
  static toDomain(dto: WordDto & { synced: boolean; isDeleted: boolean }, currOwner: OwnerId): WordEntity {
    // if (dto.value === undefined) console.log('>>>>>> WordMapper toDomain dto = ', dto);
    return WordEntity.restore({ ...dto, metadata: { synced: dto.synced, isDeleted: dto.isDeleted } }, currOwner);
  }

  // Из Фронтенда в API (Infrastructure)
  /**
   * Из Сущности в DTO (для отправки на сервер API и IndexedDB)
   */
  static toPersistence(entity: WordEntity): WordDto {
    const props = entity.getProps(); // Получаем замороженный объект свойств

    return {
      id: entity.id.value,
      value: props.value.value,
      ownerId: props.ownerId.value,
      language: props.language,
      sense: props.sense,
      translations: props.translations.map((t) => ({
        id: t.id.value,
        value: t.value,
        language: t.language,
        description: t.description,
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      })),
      isPublic: props.isPublic,
      image: props.image ? { url: props.image.url, description: props.image.description } : null,
    };
  }

  /**
   * Из OfflineEntry (IndexedDB) в Сущность
   */
  static fromOffline(entry: OfflineEntry<WordDto>, ownerId: OwnerId): WordEntity {
    // Собираем сущность, объединяя данные из data и технические поля из обертки
    return WordEntity.restore(
      {
        ...entry.data,
        metadata: { synced: entry.synced, isDeleted: entry.isDeleted },
        // synced: entry.synced,
        updatedAt: entry.updatedAt,
        // isDeleted: entry.isDeleted,
      },
      ownerId,
    );
  }
}
