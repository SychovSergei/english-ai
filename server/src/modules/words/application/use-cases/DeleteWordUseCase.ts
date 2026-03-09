import { inject, injectable } from 'inversify';

import { EventBus } from '@events/EventBus';

import { EUserRole } from '@core/domain/enums';
import { AuthError } from '@modules/auth/domain/errors';
import { WordError } from '@modules/words/domain/errors';
import { WordDeletedEvent } from '@modules/words/domain/events';

import { BaseUseCase } from '@core/application/use-cases/BaseUseCase';
import { WordRepository } from '@modules/words/application';
import { DeleteWordCommand } from '@modules/words/application/commands';
import { GuestWordLimitService } from '@modules/words/application/services/GuestWordLimitService';

import { CORE_TYPES } from '@core/constants/types';
import { WORDS_TYPES } from '@modules/words/constants/words.types';

@injectable()
export class DeleteWordUseCase extends BaseUseCase<DeleteWordCommand, string> {
  constructor(
    @inject(WORDS_TYPES.WordRepository) private wordRepo: WordRepository,
    @inject(WORDS_TYPES.GuestWordLimitService) private guestWordLimitService: GuestWordLimitService,
    @inject(CORE_TYPES.EventBus) private eventBus: EventBus,
  ) {
    super();
  }

  async execute(cmd: DeleteWordCommand): Promise<string> {
    const actor = this.actor;

    // 1. Ищем слово в базе
    const word = await this.wordRepo.findById(cmd.wordId);
    if (!word) throw WordError.NotFound(cmd.wordId);

    // 2. Security Check
    // Только владелец слова или Админ/Учитель могут его менять
    const isOwner = word.owner.value === actor.id;
    const isAdmin = actor.role === EUserRole.ADMIN || actor.role === EUserRole.TEACHER;
    if (!isOwner && !isAdmin) throw AuthError.Forbidden('You do not have permission to delete this word');

    const deletedWordId = await this.wordRepo.delete(cmd.wordId);

    // Публикация события удаления
    await this.eventBus.publish(
      new WordDeletedEvent({ wordId: cmd.wordId, value: word.value, owner: word.owner.value }),
    );

    return deletedWordId;
  }
}
