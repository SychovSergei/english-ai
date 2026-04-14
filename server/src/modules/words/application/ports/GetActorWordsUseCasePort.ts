import { Word } from '@modules/words/domain/entities';

export interface GetActorWordsUseCasePort {
  // execute(userId: string): Promise<Word[]>;
  execute(): Promise<Word[]>;
}
