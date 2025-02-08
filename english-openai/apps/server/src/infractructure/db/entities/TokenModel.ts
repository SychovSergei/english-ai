import { model, Model, Schema } from "mongoose";

import { EDbModels } from "../enums/db-models.enum";
import { UserRefreshTokenModel } from "./schemas/token-schema";

type TokensModel = Model<UserRefreshTokenModel>;

const tokenModelSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: EDbModels.User },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true },
);

const TokenModel: TokensModel = model<UserRefreshTokenModel, TokensModel>(EDbModels.Token, tokenModelSchema);

export default TokenModel;
