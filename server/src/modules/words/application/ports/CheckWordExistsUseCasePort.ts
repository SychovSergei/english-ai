import { CheckWordExistsCommand } from '@modules/words/application/commands/CheckWordExistsCommand';
import { CheckWordExistsResult } from '@modules/words/application/use-cases/CheckWordsExistsUseCase';

export interface CheckWordExistsUseCasePort {
  execute(command: CheckWordExistsCommand): Promise<CheckWordExistsResult[]>;
}
