import { inject, injectable } from 'inversify';

import { EventBus } from '@events/EventBus';

import { Word } from '@modules/words/domain/entities/Word';

import { IdentityProvider } from '@core/application/ports/auth/IdentityProvider';
import { WordRepository } from '@modules/words/application';
import { WordsFetchedEvent } from '@modules/words/application/events/WordsFetchedEvent';
import { GetActorWordsUseCasePort } from '@modules/words/application/ports';

import { CORE_TYPES } from '@core/constants/types';
import { WORDS_TYPES } from '@modules/words/constants/words.types';

@injectable()
export class GetActorWordsUseCase implements GetActorWordsUseCasePort {
  constructor(
    @inject(CORE_TYPES.IdentityProvider)
    private readonly identityProvider: IdentityProvider,

    @inject(WORDS_TYPES.WordRepository)
    private readonly wordRepo: WordRepository,

    @inject(CORE_TYPES.EventBus)
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<Word[]> {
    // Получаем текущего актора (User или Guest) из контекста
    console.log('GetActorWordsUseCase execute');
    const actor = this.identityProvider.getCurrentActor();
    const ownerId = actor.toOwnerId();
    // console.log('actor', actor);
    console.log('ownerId', ownerId);

    const words = await this.wordRepo.findAllByOwnerId(ownerId);
    // console.log('words[0]', words[0]);
    await this.eventBus.publish(new WordsFetchedEvent({ ownerId, wordsLength: words.length, actor: actor }));

    return words;
  }
}
