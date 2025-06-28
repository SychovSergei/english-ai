import { NextFunction, Request, Response } from 'express';
import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { Tokens } from '@core/domain/entities';
import { UserLogin, UserRegister, UserRegisterResponse } from '@core/domain/entities';
import { IAuthService } from '@core/repositories';

import { REFRESH_TOKEN_LIFETIME_SEC } from '../../../config';

@injectable()
export class AuthController {
  // private readonly maxAge: number = 3;

  constructor(@inject(DiTypes.AuthService) private authService: IAuthService) {}

  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as UserRegister;
      const userData: UserRegisterResponse = await this.authService.register(body);

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as UserLogin;
      const tokens: Tokens = await this.authService.login(body);

      /** send refreshToken to client in cookie
       *  httpOnly: true - чтобы нельзя было изменять и получать внутри браузера */
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true, // close access to cookie from JavaScript
        secure: false, // true for HTTPS in production mode
        sameSite: 'lax', // for develop mode -> lax or strict
        maxAge: REFRESH_TOKEN_LIFETIME_SEC * 1000, // lifetime cookie
        path: '/',
      });

      return res.status(200).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      await this.authService.logout(refreshToken);
      // res.clearCookie("refreshToken");
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === "production",
        sameSite: 'lax',
        path: '/', //  ОБЯЗАТЕЛЬНО
        // domain: "localhost", // Добавь явно
      });
      return res.status(200).send({ success: 'Logout success!' });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const tokens: Tokens = await this.authService.refresh(refreshToken);
      console.log('tokens refresh =', tokens.refreshToken);
      console.log('tokens access =', tokens.accessToken);
      res.cookie('refreshToken', tokens.refreshToken, { maxAge: REFRESH_TOKEN_LIFETIME_SEC * 1000, httpOnly: true });
      return res.status(200).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }
}
