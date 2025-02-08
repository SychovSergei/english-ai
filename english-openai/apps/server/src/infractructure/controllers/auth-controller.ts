import { Request, Response, NextFunction } from "express";
import { UserLogin, UserRegister, UserRegisterResponseClient } from "../db/entities/schemas/user-schema";

import { Tokens } from "../db/entities/schemas/token-schema";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IAuthService } from "../../core/repositories/AuthRepository/AuthRepository";

@injectable()
export class AuthController {
  private readonly maxAge: number = 3;

  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as UserRegister;
      const userData: UserRegisterResponseClient = await this.authService.register(body);

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as UserLogin;
      // : IUserRespond<UserDto>
      const tokens: Tokens = await this.authService.login(body);

      /** send refreshToken to client in cookie
       *  httpOnly: true - чтобы нельзя было изменять и получать внутри браузера */
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true, // close access to cookie from JavaScript
        secure: false, // true for HTTPS in production mode
        sameSite: "lax", // for develop mode -> lax or strict
        maxAge: this.maxAge * 24 * 60 * 60 * 1000, // Время жизни cookie (7 дней)
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
      res.clearCookie("refreshToken");
      return res.status(200).send({ success: "Logout success!" });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const tokens: Tokens = await this.authService.refresh(refreshToken);
      res.cookie("refreshToken", tokens.refreshToken, { maxAge: this.maxAge * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(200).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }
}
