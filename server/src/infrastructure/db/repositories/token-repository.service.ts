import { injectable } from 'inversify';

import { UserRefreshToken } from '@core/domain/entities';
import { ITokenRepositoryService } from '@core/repositories';
import { TokenModel } from '@infrastructure/db/entities';

@injectable()
export class TokenRepositoryService implements ITokenRepositoryService {
  async findByUserId(userId: string): Promise<UserRefreshToken | null> {
    const token = await TokenModel.findOne({ userId });
    return token !== null ? token.toObject() : null;
  }

  async updateToken(userId: string, refreshToken: string): Promise<UserRefreshToken | null> {
    return TokenModel.findOneAndUpdate(
      { userId },
      { refreshToken },
      { new: true }, // return updated document
    );
  }

  async createToken(userId: string, refreshToken: string): Promise<UserRefreshToken> {
    const newToken = await TokenModel.create({ userId, refreshToken });
    return newToken.toObject();
  }

  async removeTokenByValue(refreshToken: string): Promise<UserRefreshToken | null> {
    const removedToken = await TokenModel.findOneAndDelete({ refreshToken });
    return removedToken?.toObject() || removedToken;
  }

  async removeTokenByUserId(userId: string): Promise<UserRefreshToken | null> {
    const removedToken = await TokenModel.findOneAndDelete({ userId });
    return removedToken?.toObject() || removedToken;
  }
}
