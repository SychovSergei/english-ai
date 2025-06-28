import { z } from 'zod';

import { CustomZodObjectId } from '@core/domain/utils';

export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// const createRefreshTokenSchema = <T extends string | Types.ObjectId>() => {
const createRefreshTokenSchema = () => {
  /** const custom = z.custom<T>((val: T) => typeof val === "string" || val instanceof Types.ObjectId); */
  return z.object({
    // userId: custom,
    userId: CustomZodObjectId.optional(),
    refreshToken: z.string(),
  });
};

// export const refreshTokenSchemaServer = createRefreshTokenSchema<Types.ObjectId>();
export const refreshTokenSchema = createRefreshTokenSchema();
