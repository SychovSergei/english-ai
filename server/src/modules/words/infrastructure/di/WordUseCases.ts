import { inject, injectable } from 'inversify';

import {
  CheckWordExistsUseCasePort,
  CreateWordUseCasePort,
  GetActorWordsUseCasePort,
} from '@modules/words/application/ports';
import { DeleteWordUseCase, UpdateWordUseCase } from '@modules/words/application/use-cases';

import { WORDS_TYPES } from '@modules/words/constants/words.types';

@injectable()
export class WordUseCases {
  constructor(
    @inject(WORDS_TYPES.GetActorWordsUseCase)
    public readonly getActorWordsUC: GetActorWordsUseCasePort,

    @inject(WORDS_TYPES.CreateWordUseCase)
    public readonly createWordUC: CreateWordUseCasePort,

    @inject(WORDS_TYPES.CheckWordExistsUseCase)
    public readonly checkWordExistsUC: CheckWordExistsUseCasePort,

    @inject(WORDS_TYPES.UpdateWordUseCase)
    public readonly updateWordUC: UpdateWordUseCase,

    @inject(WORDS_TYPES.DeleteWordUseCase)
    public readonly deleteWordUC: DeleteWordUseCase,
  ) {}
}
