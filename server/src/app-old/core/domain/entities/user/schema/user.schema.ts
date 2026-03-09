import { z } from 'zod';

import { userSettingsSchema } from '@core/domain/entities';
import { EUserRole } from '@core/domain/enums';
import { CustomZodObjectId } from '@core/domain/utils';

export const userNameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

function createUserSchema() {
  // function createUserSchema<T extends string | Types.ObjectId>(type: "string" | "ObjectId") {
  // const custom = z.custom<T>((val) => typeof val === "string" || val instanceof Types.ObjectId);
  // const idSchema = type === "ObjectId" ? custom.optional() : custom;

  const baseSchema = z.object({
    id: CustomZodObjectId.optional(),
    _id: CustomZodObjectId.optional(),

    name: userNameSchema,
    email: z.string().email('Email invalid'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(EUserRole),
    wordSets: z.array(CustomZodObjectId).optional(),
    sharedWordSets: z.array(CustomZodObjectId).optional(),
    trainingSessions: z.array(CustomZodObjectId).optional(),
    settingsId: CustomZodObjectId.optional(),
    // students: z.array(custom),
    isActivated: z.boolean(),
    activationId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  return baseSchema;
}

export const userSchema = createUserSchema();

export const userRegisterSchema = userSchema.pick({ name: true, email: true, password: true });

export const userLoginSchema = userSchema.pick({ email: true, password: true });

export const userLoginDataForTokensSchema = userSchema.omit({ activationId: true, password: true });

export const userDataForTokensModify = userSchema
  .omit({ settingsId: true, password: true, activationId: true })
  .extend({
    settings: userSettingsSchema,
  });

/** the same as UserDataForTokens / maybe replace by UserLoginDataForTokens???? */
export type UserLoginRespond = z.infer<typeof userLoginDataForTokensSchema>; // TODO - сделать схему для accessToken: string; + refreshToken: string;-----

/** для ответа от сервера при регистрации юзера */
export const userRegisterResponseSchema = userSchema.pick({ id: true, name: true, email: true });

export const createUserDTOSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
  settingsId: true,
  activationId: true,
});
