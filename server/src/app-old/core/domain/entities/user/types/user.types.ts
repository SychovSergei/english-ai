import { z } from 'zod';

import {
  createUserDTOSchema,
  userDataForTokensModify,
  userLoginDataForTokensSchema,
  userLoginSchema,
  userNameSchema,
  userRegisterResponseSchema,
  userRegisterSchema,
  userSchema,
} from '../schema/user.schema';

export type UserName = z.infer<typeof userNameSchema>; // Для клиента

export type User = z.infer<typeof userSchema>; // Для клиента

export type UserRegister = z.infer<typeof userRegisterSchema>; // данные от клиента для регистрации юзера

export type UserLogin = z.infer<typeof userLoginSchema>; // данные от клиента для login

export type UserDataForTokens = z.infer<typeof userLoginDataForTokensSchema>; // данные для токена для клиента

export type UserDataForTokensModify = z.infer<typeof userDataForTokensModify>;

export type UserLoginRespond = z.infer<typeof userLoginDataForTokensSchema>; // TODO - сделать схему для accessToken: string; + refreshToken: string;-----

export type UserRegisterResponse = z.infer<typeof userRegisterResponseSchema>;

export type ICreateUser = z.infer<typeof createUserDTOSchema>;
