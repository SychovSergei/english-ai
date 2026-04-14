import { Word } from '@modules/words/domain/entities';

import { CreateWordCommand } from '@modules/words/application/commands';

export interface CreateWordUseCasePort {
  execute(cmd: CreateWordCommand): Promise<Word>;
}
