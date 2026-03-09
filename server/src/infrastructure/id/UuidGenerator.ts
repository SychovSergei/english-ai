import { randomUUID } from 'crypto';

// import { v4 as uuidv4 } from 'uuid';
import { IdGenerator } from '@core/application/ports';

export class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID().replace(/-/g, '');
    // return uuidv4().toString().replace(/-/g, '');
  }
}
