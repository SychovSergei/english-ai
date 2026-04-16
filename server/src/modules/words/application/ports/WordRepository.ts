import { OwnerId } from '@core/domain/identity/OwnerId';
import { Word } from '@modules/words/domain/entities';

export interface WordRepository {
  findById(wordIid: string): Promise<Word | null>;
  // findAllByOwnerId(ownerId: OwnerId): Promise<Word[]>;
  findAllByOwnerId(ownerId: OwnerId): Promise<Word[]>;
  findAllByValueForActor(value: string, actorId: string): Promise<Word[]>;
  save(word: Word): Promise<void>;
  update(word: Word): Promise<void>;
  delete(wordId: string): Promise<string>;
}
