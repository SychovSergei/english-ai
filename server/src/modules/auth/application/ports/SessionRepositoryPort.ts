import { Session } from '@modules/auth/domain/entities';

export interface SessionRepositoryPort {
  save(session: Session): Promise<void>;
  findByToken(token: string): Promise<Session | null>;
  findByUserAndFingerprint(userId: string, fingerprint: string): Promise<Session | null>;
  delete(id: string): Promise<void>;
  deleteByToken(token: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}
