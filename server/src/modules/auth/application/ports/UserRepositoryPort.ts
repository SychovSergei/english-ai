import { User } from '@modules/auth/domain/entities/User';

export interface UserRepositoryPort {
  create(user: User): Promise<string | null>;
  save(user: User): Promise<string | null>;
  findById(email: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
}
