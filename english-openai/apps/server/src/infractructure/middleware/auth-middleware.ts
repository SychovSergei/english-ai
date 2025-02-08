import { Response, NextFunction } from "express";

import tokenService from "../../core/services/token-service";
import { AuthError } from "../../core/errors/auth-error";
import TokenModel from "../db/entities/TokenModel";
import { CustomRequest } from "../interfaces--/custom-request.interface";

export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  // 1. Проверяем Access Token
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;
  if (!authHeader) {
    return next(AuthError.UnauthorizedAccessToken("Access token missing"));
  }
  if (!refreshToken) {
    return next(AuthError.UnauthorizedRefreshToken("Refresh token missing"));
  }

  const accessToken = req.headers.authorization!.split(" ")[1];

  try {
    const decodedAccess = tokenService.validateAccessToken(accessToken);
    const decodedRefresh = tokenService.validateRefreshToken(refreshToken);
    if (!decodedAccess) {
      return next(AuthError.UnauthorizedAccessToken("Access token invalid!!!"));
    }
    if (!decodedRefresh) {
      return next(AuthError.UnauthorizedRefreshToken("Refresh token invalid"));
    }

    const userSession = await TokenModel.findOne({ userId: decodedAccess.id }).lean();
    if (!userSession) {
      return next(AuthError.UnauthorizedRefreshToken("Session is expired!"));
    }

    req.user = decodedAccess; // Добавляем пользователя в запрос

    next();
  } catch (error) {
    console.warn("Access Token недействителен:", error);
    if (error) {
      next(AuthError.UnauthorizedAccessToken("Access token invalid!"));
    }

    // 2. Проверяем Refresh Token
    // const refreshToken = req.cookies.refreshToken;
    // if (!refreshToken) {
    //   next(AuthError.UnauthorizedRefreshToken("Refresh token отсутствует"));
    // }
    // try {
    //   const decodedRefresh = tokenService.validateRefreshToken(refreshToken);
    //   if (!decodedRefresh) {
    //     return next(AuthError.UnauthorizedRefreshToken("Refresh token недействителен"));
    //   }
    //
    //   // 3. Ищем пользователя в базе
    //   const user = await UserModel.findOne({ email: decodedRefresh.email }).lean();
    //   if (!user) {
    //     return next(UserError.NotFound(`Пользователь ${decodedRefresh.email} не найден`));
    //   }
    //
    //   // 4. Формируем данные и генерируем новые токены
    //   const userDto: UserDataForTokens = {
    //     id: user._id!.toString(),
    //     name: user.name,
    //     email: user.email,
    //     role: user.role,
    //     wordSets: user.wordSets.map((id: Types.ObjectId) => id.toString()),
    //     sharedWordSets: user.sharedWordSets.map((id: Types.ObjectId) => id.toString()),
    //     trainingSessions: user.trainingSessions.map((id: Types.ObjectId) => id.toString()),
    //     settings: user.settings.toString(),
    //     isActivated: user.isActivated,
    //     createdAt: user.createdAt,
    //     updatedAt: user.updatedAt,
    //   };
    //
    //   const newAccessToken = jwt.sign(userDto, config.jwt.access_key!, { expiresIn: "20s" });
    //   const newRefreshToken = jwt.sign(userDto, config.jwt.refresh_key!, { expiresIn: "90s" });
    //
    //   // 5. Сохраняем токены и обновляем заголовок
    //   await TokenModel.updateOne(
    //     { userId: userDto.id },
    //     { refreshToken: newRefreshToken },
    //     { upsert: true }, // Создаем запись, если её не было
    //   );
    //
    //   res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
    //   req.headers.authorization = `Bearer ${newAccessToken}`;
    //   req.user = userDto;
    //   return next();
    // } catch (refreshTokenError) {
    //   console.warn("Refresh Token недействителен:", refreshTokenError);
    //
    //   // Удаляем недействительный токен из базы
    //   await TokenModel.findOneAndDelete({ refreshToken });
    //   res.clearCookie("refreshToken");
    //   return next(AuthError.UnauthorizedRefreshToken("Недействительный Refresh token"));
    // }
  }
};
