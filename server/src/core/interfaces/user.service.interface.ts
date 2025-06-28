import { ICreateUser, User } from '@core/domain/entities';

export interface IUserService {
  getAll(): Promise<User[]>;
  createUser(userData: ICreateUser): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;

  // getUserForTokenByEmail(email: string): Promise<UserDataForTokensModify | null>;
}
