import { Actor } from '@core/domain/identity/Actor';
import { OwnerId } from '@core/domain/identity/OwnerId';
import { Word, WordTranslation } from '@modules/words/domain/entities';
import { TranslationId, WordId } from '@modules/words/domain/value-objects';

import { WordResponseDto } from '@modules/words/application/dto/WordDTO';

import { WordPersistence, WordTranslationPersistence } from '@modules/words/infrastructure/persistence/models';
import { GuestActor } from '@core/application/identity/GuestActor';

export class WordMapper {
  /** The Data To the Client */
  static toResponseDTO(word: Word, actor: Actor): WordResponseDto {
    const dto: WordResponseDto = {
      id: word.id.value,
      value: word.value,
      ownerId: word.owner.value,
      language: word.language,
      translations: word.translations.map((t) => ({
        id: t.id.value,
        value: t.value,
        language: t.language,
        description: t.description,
        lexicalCategory: t.lexicalCategory,
        difficultyLevel: t.difficultyLevel,
      })),
      sense: word.sense,
      // isPublic: word.isPublic,
      image: { url: word.image?.url ?? '', description: word.image?.description },
      updatedAt: word.updatedAt?.getTime() ?? Date.now(),
    };

    // 2. Логика для Гостя (ограничения)
    if (actor instanceof GuestActor) {
      return dto;
    }
    /**
    // 3. Логика для Студента (добавляем прогресс)
    if (actor.role === ERoles.STUDENT) {
      dto.progress = {
        mastery: word.progress?.mastery || 0,
        nextReviewDate: word.progress?.nextReviewDate
      };
    }

    // 4. Логика для Учителя и Админа (управление)
    if (actor.role === ERoles.TEACHER || actor.role === ERoles.ADMIN) {
      dto.isPublic = word.isPublic;
      dto.creatorId = word.userId;
      dto.createdAt = word.createdAt;
    }

    // 5. Только для Админа
    if (actor.role === ERoles.ADMIN) {
      dto.usageCount = word.usageCount;
    }*/

    return dto;
  }

  /** The Data to the DB */
  static toPersistence(word: Word): WordPersistence {
    console.log('WordMapper -> toPersistence -> word =', JSON.stringify(word, null, 2));
    return {
      // _id: new Types.ObjectId(word.id.value),
      _id: word.id.value,

      ownerId: word.owner.value,
      ownerKind: word.owner.kind,

      value: word.value,
      language: word.language,

      translations: word.translations.map<WordTranslationPersistence>((t) => ({
        // _id: new Types.ObjectId(t.id.value),
        _id: t.id.value,
        value: t.value,
        language: t.language,
        description: t.description,
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      })),

      isPublic: word.isPublic,
      image: word.image,

      // createdAt: word.,
      // updatedAt: new Date(), // TODO CHECK IT
    };
  }

  /** The data to the Domain (Business logic)*/
  static toDomain(doc: WordPersistence): Word {
    // console.log(doc._id.toString(), doc.value);
    return Word.create({
      id: WordId.from(doc._id.toString()),
      value: doc.value,
      owner: new OwnerId(doc.ownerKind, doc.ownerId),
      language: doc.language,
      sense: doc.sense ?? null,
      translations: doc.translations.map((t) =>
        WordTranslation.create({
          id: TranslationId.from(t._id.toString()),
          value: t.value,
          language: t.language,
          description: t.description,
          difficultyLevel: t.difficultyLevel,
          lexicalCategory: t.lexicalCategory,
        }),
      ),
      isPublic: doc.isPublic,
      image: doc.image,
    });
  }
}
