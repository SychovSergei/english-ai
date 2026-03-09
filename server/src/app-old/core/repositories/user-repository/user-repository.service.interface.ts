import { User } from '@core/domain/entities';
// import { UserDataForTokensModify } from "@application/services/AuthService";

export interface IUserRepositoryService {
  getAll(): Promise<User[]>;
  createUser(userData: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;

  // getUserForTokenByEmail(email: string): Promise<UserDataForTokensModify | null>;
}
