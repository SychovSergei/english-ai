import { DomainEvent } from '@core/domain/base/DomainEvent';
import { Actor } from '@core/domain/identity/Actor';
import { OwnerId } from '@core/domain/identity/OwnerId';

export class WordsFetchedEvent extends DomainEvent {
  constructor(public readonly payload: { ownerId: OwnerId; wordsLength: number; actor: Actor }) {
    super('WordsFetchedEvent', payload);
  }
}
