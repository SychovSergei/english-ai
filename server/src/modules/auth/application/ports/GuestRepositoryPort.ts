import { Guest } from '@modules/auth/domain/entities/Guest';

export interface GuestRepositoryPort {
  save(guest: Guest): Promise<void>;
  create(guest: Guest): Promise<string | null>;
  findById(id: string): Promise<Guest | null>;
  findByFingerprint(id: string): Promise<Guest | null>;
}
