import { inject, injectable } from 'inversify';

import { Guest } from '@modules/auth/domain/entities/Guest';

import { IdGenerator } from '@core/application/ports';
import { BaseUseCase } from '@core/application/use-cases/BaseUseCase';
import { GuestRepositoryPort } from '@modules/auth/application/ports/GuestRepositoryPort';
import { IdentifyGuestCommand } from '@modules/words/application/commands/IdentifyGuestCommand';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

@injectable()
export class IdentifyGuestUseCase extends BaseUseCase<IdentifyGuestCommand, Guest> {
  constructor(
    @inject(AUTH_TYPES.GuestRepository) private guestRepo: GuestRepositoryPort,
    @inject(CORE_TYPES.IdGenerator) private idGenerator: IdGenerator,
  ) {
    super();
  }

  async execute(cmd: IdentifyGuestCommand): Promise<Guest> {
    let guest: Guest | null = null;
    console.log('IdentifyGuestUseCase -> execute -> cmd', cmd);
    if (cmd.guestId) guest = await this.guestRepo.findById(cmd.guestId);

    if (!guest && cmd.fingerprint) guest = await this.guestRepo.findByFingerprint(cmd.fingerprint);

    if (guest) return guest;

    // Если не нашли гостя (заходит впервые, новый гость), то создаем в базе его отпечаток
    const newGuest = new Guest(
      {
        fingerprint: cmd.fingerprint,
        ip: cmd.ip,
        createdAt: new Date(),
      },
      this.idGenerator.generate(),
    );

    await this.guestRepo.save(newGuest);

    return newGuest;
  }
}
