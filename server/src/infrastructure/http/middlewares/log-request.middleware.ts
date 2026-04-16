import { NextFunction, Request, Response } from 'express';

// import { CustomRequest } from '@infrastructure/http/interfaces';

export const logRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`\x1b[1m\x1b[4m\x1b[32m >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\x1b[0m`);
  console.log(`\x1b[1m\x1b[4m\x1b[32m Incoming request: ${req.method} ${req.url}\x1b[0m`);
  console.log('URL:', req.url);
  console.log('IP:', req.ip);
  console.log('Origin:', req.headers.origin);
  // console.log('Origin:', req.protocol, req.hostname, req.get('host'));
  console.log('user-agent:', req.headers['user-agent']);

  next();
};
