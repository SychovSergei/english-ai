import { JwtPayload } from 'jsonwebtoken';
import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { Tokens, UserRefreshToken } from '@core/domain/entities';
import { UserLoginRespond } from '@core/domain/entities';
import { IJwtService, ITokenService } from '@core/interfaces';
import { ITokenRepositoryService } from '@core/repositories';

import config, { ACCESS_TOKEN_LIFETIME_SEC, REFRESH_TOKEN_LIFETIME_SEC } from '../../config';

@injectable()
export class TokenService implements ITokenService {
  constructor(
    @inject(DiTypes.JwtService) private jwtService: IJwtService,
    @inject(DiTypes.TokenRepositoryService) private tokenRepositoryService: ITokenRepositoryService,
  ) {}

  generateTokens<T extends object>(payload: T): Tokens {
    console.log('TokenService generateTokens');
    let accessToken: string = '';
    let refreshToken: string = '';
    if (config && config.jwt && config.jwt.access_key && config.jwt.refresh_key) {
      accessToken = this.jwtService.createToken(payload, config.jwt.access_key, {
        expiresIn: Math.floor(ACCESS_TOKEN_LIFETIME_SEC),
      });
      refreshToken = this.jwtService.createToken(payload, config.jwt.refresh_key, {
        expiresIn: Math.floor(REFRESH_TOKEN_LIFETIME_SEC),
      });
    }
    console.log('TokenService generateTokens 22222');

    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): (UserLoginRespond & JwtPayload) | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.jwtService.verifyToken<UserLoginRespond>(token, config.jwt.access_key!);
      // return jwt.verify(token, config.jwt.access_key!, { complete: true }).payload as UserLoginRespond & JwtPayload;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  validateRefreshToken(token: string): (UserLoginRespond & JwtPayload) | null {
    try {
      // return jwt.verify(
      //   token,
      //   config.jwt.refresh_key!,
      //   { complete: true },
      // ).payload as UserLoginRespond & JwtPayload;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.jwtService.verifyToken<UserLoginRespond>(token, config.jwt.refresh_key!);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findRefreshToken(userId: string): Promise<UserRefreshToken | null> {
    return await this.tokenRepositoryService.findByUserId(userId);
    // (await TokenModel.findOne({ userId }).lean({
    //   virtuals: true,
    // })) as DocResponseWithId<UserRefreshToken> | null;
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<UserRefreshToken | null> {
    const tokenData = await this.tokenRepositoryService.findByUserId(userId); //await tokenModel.findOne({ userId: userId });
    if (tokenData) {
      return this.tokenRepositoryService.updateToken(userId, refreshToken);
      // tokenData.refreshToken = refreshToken;
      //
      // return tokenData.save();
    }
    return await this.tokenRepositoryService.createToken(userId, refreshToken);
  }

  // : Promise<string | null>
  async removeToken(refreshToken: string): Promise<string | null> {
    //: DocResponseWithId<UserRefreshToken> | null
    const resultDelete = await this.tokenRepositoryService.removeTokenByValue(refreshToken);

    return resultDelete ? resultDelete.refreshToken : null;
  }

  async removeTokenByUserId(id: string): Promise<string | null> {
    const resultDelete = await this.tokenRepositoryService.removeTokenByUserId(id);
    // const resultDelete: DocResponseWithId<UserRefreshToken> | null = await tokenModel.findOneAndDelete({
    //   userId: id,
    // });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return resultDelete ? resultDelete.userId!.toString() : resultDelete;
  }
}

// const tokenService = new TokenService();
//
// export default tokenService;
