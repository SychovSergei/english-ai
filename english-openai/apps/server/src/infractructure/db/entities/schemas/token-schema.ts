import { z } from "zod";
import { Types } from "mongoose";

export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type Tokens = z.infer<typeof TokensSchema>; // токены для отправки на клиент
// export type UserRefreshToken = z.infer<typeof refreshTokenSchema>; // данные для хранения в базе данных

const createRefreshTokenSchema = <T extends string | Types.ObjectId>() => {
  const custom = z.custom<T>((val: T) => typeof val === "string" || val instanceof Types.ObjectId);

  return z.object({
    userId: custom,
    refreshToken: z.string(),
  });
};

export const refreshTokenSchemaServer = createRefreshTokenSchema<Types.ObjectId>();
export const refreshTokenSchemaClient = createRefreshTokenSchema<string>();

// Генерация типов
export type UserRefreshTokenModel = z.infer<typeof refreshTokenSchemaServer>; // Для сервера (userId: ObjectId)
export type UserRefreshToken = z.infer<typeof refreshTokenSchemaClient>; // Для клиента (userId: string)
