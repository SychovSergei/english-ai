import {
  User,
  UserLogin,
  UserDataForTokens,
  UserRegister,
  UserRegisterResponseClient,
} from "../../server/src/infractructure/db/entities/schemas/user-schema";

export interface IUserClient extends User {}
export interface SharedUserRegistration extends UserRegister {}
export interface SharedUserRegisterResponse
  extends UserRegisterResponseClient {}
export interface UserLoginShared extends UserLogin {}
export interface SharedUserDataForTokens extends UserDataForTokens {}

export interface IUserName {
  firstName: string;
  lastName: string;
}
