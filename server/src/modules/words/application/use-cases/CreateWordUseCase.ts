import { inject, injectable } from 'inversify';

import { EventBus } from '@events/EventBus';

import { OwnerId } from '@core/domain/identity/OwnerId';
import { Word } from '@modules/words/domain/entities';
import { WordTranslation } from '@modules/words/domain/entities/WordTranslation';
import { TranslationId } from '@modules/words/domain/value-objects';
import { WordId } from '@modules/words/domain/value-objects/WordId';

import { GuestActor } from '@core/application/identity/GuestActor';
import { IdGenerator } from '@core/application/ports';
import { BaseUseCase } from '@core/application/use-cases/BaseUseCase';
import { CreateWordCommand } from '@modules/words/application/commands/CreateWordCommand';
import { CreateWordUseCasePort, GuestWordLimitServicePort, WordRepository } from '@modules/words/application/ports';

import { CORE_TYPES } from '@core/constants/types';
import { WORDS_TYPES } from '@modules/words/constants/words.types';

@injectable()
export class CreateWordUseCase extends BaseUseCase<CreateWordCommand, Word> implements CreateWordUseCasePort {
  constructor(
    @inject(CORE_TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(CORE_TYPES.IdGenerator) private readonly idGenerator: IdGenerator,
    @inject(WORDS_TYPES.WordRepository) private readonly wordRepo: WordRepository,
    @inject(WORDS_TYPES.GuestWordLimitService) private readonly guestWordLimitService: GuestWordLimitServicePort,
  ) {
    super();
  }

  async execute(cmd: CreateWordCommand): Promise<Word> {
    const actor = this.identityProvider.getCurrentActor();
    console.log('CreateWordUseCase -> execute -> actor', actor);

    if (actor instanceof GuestActor) {
      // await this.guestWordLimitService.checkLimit(actor.id);
      await this.guestWordLimitService.assertCanCreateWord(actor);
    }

    const wordId: WordId = cmd.id ? WordId.from(cmd.id) : WordId.generate(() => this.idGenerator.generate());
    const ownerId: OwnerId = actor.toOwnerId();
    const translations = cmd.translations.map((t) => {
      console.log('CreateWordUseCase -> execute -> t', JSON.stringify(t, null, 2));
      return WordTranslation.create({
        id: t.id ? TranslationId.from(t.id) : TranslationId.from(this.idGenerator.generate()),
        value: t.value,
        language: t.language,
        description: t.description,
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      });
    });
    console.log('CreateWordUseCase -> execute -> wordId', wordId);
    console.log('CreateWordUseCase -> execute -> ownerId', ownerId);
    console.log('CreateWordUseCase -> execute -> translations', JSON.stringify(translations));
    const word = Word.create({
      id: wordId,
      value: cmd.value,
      owner: ownerId,
      language: cmd.language,
      sense: cmd.sense,
      translations: translations,

      isPublic: cmd.isPublic,
      image: cmd.image ? { url: cmd.image.url, description: cmd.image.description } : null,
    });
    console.log('CreateWordUseCase -> execute -> word', JSON.stringify(word, null, 2));

    await this.wordRepo.save(word);

    if (actor instanceof GuestActor) {
      await this.guestWordLimitService.recordWordCreated(actor);
    }

    // await this.eventBus.publish(new WordCreatedEvent({ wordId: word.id.value, value: word.value, owner: dto.owner }));
    await this.eventBus.publishMany(word.pullDomainEvents());

    return word;
  }
}
