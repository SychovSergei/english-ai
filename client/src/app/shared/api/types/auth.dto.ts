// import { User } from '@entities/user/api/user.api';
// import { Tokens } from '@shared/services/token.service';

// export type IUserLoginDTO = Pick<User, 'email' | 'password'>;
// export type IUserLoginResponse = Pick<Tokens, 'accessToken'>;

// export type IUserRegisterDTO = Pick<User, 'name' | 'email' | 'password'>;
// export type IUserRegisterResponse = Pick<User, 'name' | 'email'>;

export type IUserLoginDTO = {
  email: string;
  password: string;
};

export type IUserLoginResponse = {
  accessToken: string;
  refreshToken?: string;
  // user?: any; // Можно заменить на IUserShort или IUserSafe, если надо
};

export interface IUserRegisterDTO {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
}

export type IUserRegisterResponse = {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
};
