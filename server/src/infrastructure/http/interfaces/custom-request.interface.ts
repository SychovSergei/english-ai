import { Request } from 'express';

import { UserDataForTokens } from '@core/domain/entities';

export interface CustomRequest extends Request {
  user?: UserDataForTokens;
}
