import { NextFunction, Response } from 'express';

import { CustomRequest } from '@infrastructure/http/interfaces';

export const logRequestMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('URL:', req.url);
  console.log('IP:', req.ip);
  console.log('Origin:', req.headers.origin);
  console.log('Origin:', req.protocol, req.hostname, req.get('host'));
  console.log('user-agent:', req.headers['user-agent']);

  next();
};
