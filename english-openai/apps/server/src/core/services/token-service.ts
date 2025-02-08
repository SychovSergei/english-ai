import jwt, { JwtPayload } from "jsonwebtoken";

import config from "../../config";

import { DocResponseWithId } from "../../infractructure/interfaces--/mongo.interface";
import { UserLoginRespond } from "../../infractructure/db/entities/schemas/user-schema";
import { Tokens, UserRefreshToken } from "../../infractructure/db/entities/schemas/token-schema";
import tokenModel from "../../infractructure/db/entities/TokenModel";
import TokenModel from "../../infractructure/db/entities/TokenModel";

class TokenService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateTokens<T extends object>(payload: T): Tokens {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const accessToken: string = jwt.sign(payload, config.jwt.access_key!, { expiresIn: "30min" });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const refreshToken: string = jwt.sign(payload, config.jwt.refresh_key!, { expiresIn: "2h" });

    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): (UserLoginRespond & JwtPayload) | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return jwt.verify(token, config.jwt.access_key!, { complete: true }).payload as UserLoginRespond & JwtPayload;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): (UserLoginRespond & JwtPayload) | null {
    try {
      return jwt.verify(
        token,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config.jwt.refresh_key!,
        { complete: true },
      ).payload as UserLoginRespond & JwtPayload;
    } catch (e) {
      return null;
    }
  }

  async findRefreshToken(userId: string): Promise<UserRefreshToken | null> {
    return (await TokenModel.findOne({ userId }).lean({
      virtuals: true,
    })) as DocResponseWithId<UserRefreshToken> | null;
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await tokenModel.findOne({ userId: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      return tokenData.save();
    }
    return await tokenModel.create({ userId: userId, refreshToken });
  }

  // : Promise<string | null>
  async removeToken(refreshToken: string) {
    //: DocResponseWithId<UserRefreshToken> | null
    const resultDelete = await tokenModel
      .findOneAndDelete({
        refreshToken,
      })
      .lean();

    return resultDelete ? resultDelete.refreshToken : null;
  }

  async removeTokenByUserId(id: string): Promise<string | null> {
    const resultDelete: DocResponseWithId<UserRefreshToken> | null = await tokenModel.findOneAndDelete({
      userId: id,
    });

    return resultDelete ? resultDelete.userId : null;
  }
}

const tokenService = new TokenService();

export default tokenService;
