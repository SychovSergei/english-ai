export interface IBcryptService {
  hashPassword(password: string): Promise<string>;
  checkPassword(password: string, existsPassword: string): Promise<boolean>;
}
