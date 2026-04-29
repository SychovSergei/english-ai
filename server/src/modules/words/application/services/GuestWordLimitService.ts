import { inject, injectable } from 'inversify';

import { GuestError } from '@modules/auth/domain/errors/GuestError';

import { GuestActor } from '@core/application/identity/GuestActor';
import { ConfigServicePort } from '@core/application/ports';
import { GuestUsageRepositoryPort, GuestWordLimitServicePort } from '@modules/words/application/ports';

import { CORE_TYPES } from '@core/constants/types';
import { WORDS_TYPES } from '@modules/words/constants/words.types';

@injectable()
export class GuestWordLimitService implements GuestWordLimitServicePort {
  constructor(
    @inject(CORE_TYPES.ConfigService) private readonly config: ConfigServicePort,
    @inject(WORDS_TYPES.GuestUsageRepository) private readonly guestUsageRepository: GuestUsageRepositoryPort,
  ) {}

  async assertCanCreateWord(actor: GuestActor): Promise<void> {
    console.log('GuestWordLimitService -> assertCanCreateWord -> actor', actor);

    const used = await this.guestUsageRepository.getWordCount(actor.getGuestId);
    console.log('GuestWordLimitService -> assertCanCreateWord -> used', used);

    const maxWords = this.config.get('guest').maxWords;
    console.log('GuestWordLimitService -> assertCanCreateWord -> maxWords', maxWords);

    if (used >= maxWords) {
      throw GuestError.LimitExceeded('Guest has reached the word limit');
    }
  }

  async recordWordCreated(actor: GuestActor): Promise<void> {
    await this.guestUsageRepository.incrementWordCount(actor.getGuestId);
  }
}
