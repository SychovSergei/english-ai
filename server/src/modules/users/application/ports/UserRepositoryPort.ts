import { User } from '@modules/users/domain/entities/User';

export interface UserRepositoryPort {
  create(user: User): Promise<void>;
  save(user: User): Promise<string | null>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
}
