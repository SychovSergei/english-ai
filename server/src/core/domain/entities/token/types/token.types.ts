import { z } from 'zod';

import { refreshTokenSchema, tokensSchema } from '@core/domain/entities/token/schema/token.schema';

export type Tokens = z.infer<typeof tokensSchema>; // токены для отправки на клиент

export type UserRefreshTokenModel = z.infer<typeof refreshTokenSchema>; // Для сервера (userId: ObjectId)

export type UserRefreshToken = z.infer<typeof refreshTokenSchema>; // Для клиента (userId: string)
