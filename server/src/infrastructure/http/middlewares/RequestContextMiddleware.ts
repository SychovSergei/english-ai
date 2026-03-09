import { NextFunction, Request, Response } from 'express';

import { generateUuid } from '@core/application/ports/generate-uuid';

import { requestContext } from '@infrastructure/http/context/RequestContext';
import { inject, injectable } from 'inversify';
import { IdGenerator } from '@core/application/ports';
import { CORE_TYPES } from '@core/constants/types';

// export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
//   // Инициализируем пустой стор, который будет наполняться в процессе
//   requestContext.run(
//     {
//       requestId: generateUuid(),
//       actor: null as any,
//     },
//     next,
//   );
// }

@injectable()
export class RequestContextMiddleware {
  constructor(@inject(CORE_TYPES.IdGenerator) private idGenerator: IdGenerator) {}

  public handler = (req: Request, res: Response, next: NextFunction): void => {
    requestContext.run(
      {
        requestId: this.idGenerator.generate(),
        actor: null as any,
      },
      next,
    );
  };
}
