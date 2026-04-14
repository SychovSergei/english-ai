import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

import { PasswordHasher } from '@core/application/ports/auth/PasswordHasher';

@injectable()
export class BcryptHasher implements PasswordHasher {
  private readonly SALT_ROUNDS = 10;

  async hash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, this.SALT_ROUNDS);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }
}
