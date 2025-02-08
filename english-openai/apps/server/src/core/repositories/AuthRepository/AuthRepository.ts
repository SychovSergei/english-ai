import {
  UserLogin,
  UserRegister,
  UserRegisterResponseClient,
} from "../../../infractructure/db/entities/schemas/user-schema";
import { Tokens } from "../../../infractructure/db/entities/schemas/token-schema";

export interface IAuthService {
  register(data: UserRegister): Promise<UserRegisterResponseClient>;
  login(data: UserLogin): Promise<Tokens>;
  logout(refreshToken: string): Promise<string | null>;
  refresh(refreshToken: string | undefined): Promise<Tokens>;
}
