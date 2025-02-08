import { z } from "zod";
import { EUserRole } from "@shared/enums/user-roles.enum";
import { CustomZodObjectId } from "./custom-zod-validators";

export type Mode = "client" | "server";

export const UserNameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

function createUserSchema() {
  // function createUserSchema<T extends string | Types.ObjectId>(type: "string" | "ObjectId") {
  // const custom = z.custom<T>((val) => typeof val === "string" || val instanceof Types.ObjectId);
  // const idSchema = type === "ObjectId" ? custom.optional() : custom;

  const baseSchema = z.object({
    // id: custom,
    // id: idSchema,
    id: CustomZodObjectId.optional(),
    _id: CustomZodObjectId.optional(),

    name: UserNameSchema,
    email: z.string().email("Email invalid"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(EUserRole),
    wordSets: z.array(CustomZodObjectId).optional(),
    sharedWordSets: z.array(CustomZodObjectId).optional(),
    trainingSessions: z.array(CustomZodObjectId).optional(),
    settings: CustomZodObjectId.optional(),
    // students: z.array(custom),
    isActivated: z.boolean(),
    activationId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  return baseSchema;
}

// Схемы для сервера и клиента
// export const userSchemaServer = createUserSchema<Types.ObjectId>("ObjectId");
// export const userSchemaServer = createUserSchema();
// export const userSchemaClient = createUserSchema<string>("string");
// export const userSchemaClient = createUserSchema();
export const userSchema = createUserSchema();

// Генерация типов для серверной и клиентской части
// export type UserModelMongo = z.infer<typeof userSchemaServer>; // Для сервера
// export type UserModelMongo = z.infer<typeof userSchema>; // Для сервера
export type User = z.infer<typeof userSchema>; // Для клиента

export const userRegisterSchema = userSchema.pick({ name: true, email: true, password: true });
export const userLoginSchema = userSchema.pick({ email: true, password: true });
export const userLoginDataForTokensSchema = userSchema.omit({ activationId: true, password: true });
const userRegisterResponseSchemaServer = userSchema.pick({ name: true, email: true });
const userRegisterResponseSchemaClient = userSchema.pick({ id: true, name: true, email: true });

export type UserRegister = z.infer<typeof userRegisterSchema>; // данные от клиента для регистрации юзера
export type UserLogin = z.infer<typeof userLoginSchema>; // данные от клиента для login
export type UserDataForTokens = z.infer<typeof userLoginDataForTokensSchema>; // данные для токена для клиента
export type UserLoginRespond =
  /** the same as UserDataForTokens / maybe replace by UserLoginDataForTokens???? */
  z.infer<typeof userLoginDataForTokensSchema>; // TODO - сделать схему для accessToken: string; + refreshToken: string;-----
export type UserRegisterResponseServer = z.infer<typeof userRegisterResponseSchemaServer>;

/** для ответа от сервера при регистрации юзера */
export type UserRegisterResponseClient = z.infer<typeof userRegisterResponseSchemaClient>;
