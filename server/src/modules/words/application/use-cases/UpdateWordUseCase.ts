import { inject, injectable } from 'inversify';

import { EUserRole } from '@core/domain/enums';
import { AuthError } from '@modules/auth/domain/errors';
import { UpdateWordData, Word, WordTranslation } from '@modules/words/domain/entities';
import { WordError } from '@modules/words/domain/errors';
import { ImageAssociation, TranslationId } from '@modules/words/domain/value-objects';

import { BaseUseCase } from '@core/application/use-cases/BaseUseCase';
import { WordRepository } from '@modules/words/application';
import { UpdateWordCommand } from '@modules/words/application/commands';
import { GuestWordLimitService } from '@modules/words/application/services/GuestWordLimitService';

import { WORDS_TYPES } from '@modules/words/constants/words.types';

@injectable()
export class UpdateWordUseCase extends BaseUseCase<UpdateWordCommand, Word> {
  constructor(
    @inject(WORDS_TYPES.WordRepository) private wordRepo: WordRepository,
    @inject(WORDS_TYPES.GuestWordLimitService) private guestWordLimitService: GuestWordLimitService,
  ) {
    super();
  }

  async execute(cmd: UpdateWordCommand): Promise<Word> {
    const { id, ...payload } = cmd.payload;
    const actor = this.actor; // Из BaseUseCase

    // 1. Ищем слово в базе
    const word = await this.wordRepo.findById(id);
    if (!word) throw WordError.NotFound(payload.value);

    // 2. Security Check
    // Только владелец слова или Админ/Учитель могут его менять
    const isOwner = word.owner.value === actor.id;
    const isAdmin = actor.role === EUserRole.ADMIN || actor.role === EUserRole.TEACHER;
    if (!isOwner && !isAdmin) throw AuthError.Forbidden('You do not have permission to update this word');

    // 3. Подготовка доменных параметров
    // В DDD сущность сама должна знать, как себя обновлять (метод update)
    const domainData: UpdateWordData = {
      value: payload.value,
      sense: payload.sense,
      isPublic: payload.isPublic,
      image: payload.image ? ImageAssociation.create(payload.image) : undefined,
    };

    // Превращаем массив обычных объектов в массив Value Objects WordTranslation
    if (payload.translations) {
      domainData.translations = payload.translations.map((t) =>
        WordTranslation.create({
          id: TranslationId.from(t.id), // Важно сохранить тот же ID для БД, // Если это TranslationId, он должен быть корректно передан
          value: t.value,
          language: t.language,
          description: t.description,
          difficultyLevel: t.difficultyLevel,
          lexicalCategory: t.lexicalCategory,
        }),
      );
    }

    // 4. Вызов бизнес-логики внутри сущности
    word.update(domainData);

    console.log('WORD == for update =====', word);

    // 5. Сохраняем агрегат
    await this.wordRepo.save(word);

    return word;
  }
}
