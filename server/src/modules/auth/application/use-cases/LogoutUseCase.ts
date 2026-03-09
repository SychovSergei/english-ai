import { inject, injectable } from 'inversify';

import { EventBus } from '@events/EventBus';

import { LogoutCommand } from '@modules/auth/application/commands/LogoutCommand';
import { SessionRepositoryPort } from '@modules/auth/application/ports';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(AUTH_TYPES.SessionRepository)
    private sessionRepo: SessionRepositoryPort,

    @inject(CORE_TYPES.EventBus)
    private eventBus: EventBus,
  ) {}

  async execute(cmd: LogoutCommand): Promise<void> {
    const session = await this.sessionRepo.findByToken(cmd.refreshToken);
    console.log('[LogoutUseCase]: ', session?.id);
    if (session && session.props.userId === cmd.userId) {
      await this.sessionRepo.deleteByToken(cmd.refreshToken);
    }

    // TODO сделать публикацию события при логауте ???
    // await this.eventBus.publishMany(word.pullEvents());
  }
}
