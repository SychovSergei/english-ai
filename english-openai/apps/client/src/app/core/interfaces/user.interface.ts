import {
  IUserClient,
  SharedUserDataForTokens,
  UserLoginShared,
  SharedUserRegisterResponse,
  SharedUserRegistration,
} from '@shared/interfaces/user.interface';

export type User = IUserClient; //TODO интерфейс должен быть пересмотрен с учетом актуальных свойств

/** IUserRegistration - interface described information from registration form from client.*/
export type UserRegistration = SharedUserRegistration; //Pick<IUser, 'name' | 'email' | 'password'>;
export type UserRegistrationResponse = SharedUserRegisterResponse; //Pick<IUser, 'name' | 'email' | 'password'>;
export type UserLogin = UserLoginShared; //Pick<IUser, 'email' | 'password'>;
export type UserDataForTokens = SharedUserDataForTokens; //Pick<IUser, 'email' | 'password'>;
