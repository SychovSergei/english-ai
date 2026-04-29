import { inject, injectable } from 'inversify';

import { Word } from '@modules/words/domain/entities';

import { BaseUseCase } from '@core/application/use-cases/BaseUseCase';
import { CheckWordExistsCommand } from '@modules/words/application/commands/CheckWordExistsCommand';
import { WordRepository } from '@modules/words/application/ports';
import { CheckWordExistsUseCasePort } from '@modules/words/application/ports';

import { WORDS_TYPES } from '@modules/words/constants/words.types';

export interface CheckWordExistsResult {
  value: string;
  exists: boolean;
  variants: {
    id: string;
    sense?: string | null;
    translations: string[]; // For preview, should be shortly.
  }[];
}

@injectable()
export class CheckWordExistsUseCase
  extends BaseUseCase<CheckWordExistsCommand, CheckWordExistsResult[]>
  implements CheckWordExistsUseCasePort
{
  constructor(
    // @inject(CORE_TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(WORDS_TYPES.WordRepository) private readonly wordRepo: WordRepository,
  ) {
    super();
  }

  async execute(cmd: CheckWordExistsCommand): Promise<CheckWordExistsResult[]> {
    const results: CheckWordExistsResult[] = [];

    const actor = this.actor;

    console.log('CheckWordExistsUseCase -> execute -> actor', actor);
    console.log('CheckWordExistsUseCase -> execute -> value', cmd.value);

    // for (const wordValue of cmd.value) {
    //   const words = await this.wordRepo.findAllByValueForActor(wordValue, actor.id);
    //   // findAllByValueForActor(value: string, actorId: string): Promise<Word[]>;
    //   results.push({
    //     value: wordValue,
    //     exists: words.length > 0,
    //     variants: words.map((w: Word) => ({
    //       id: w.id.value,
    //       sense: w.sense,
    //       translations: w.translations.map((t) => t.value),
    //     })),
    //   });
    // }
    const words = await this.wordRepo.findAllByValueForActor(cmd.value, actor.id);
    results.push({
      value: cmd.value,
      exists: words.length > 0,
      variants: words.map((w: Word) => ({
        id: w.id.value,
        sense: w.sense,
        translations: w.translations.map((t) => t.value),
      })),
    });
    // await this.eventBus.publish(new WordCreatedEvent({ wordId: word.id.value, value: word.value, owner: dto.owner }));
    // await this.eventBus.publishMany(word.pullDomainEvents());

    return results;
  }
}
