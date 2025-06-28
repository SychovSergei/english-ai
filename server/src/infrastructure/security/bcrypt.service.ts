import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

import { IBcryptService } from '@core/interfaces/bcrypt.service.interface';

@injectable()
export class BcryptService implements IBcryptService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async checkPassword(password: string, existsPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, existsPassword);
  }
}
