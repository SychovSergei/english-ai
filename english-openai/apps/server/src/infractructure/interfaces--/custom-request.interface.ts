import { Request } from "express";
import { UserDataForTokens } from "../db/entities/schemas/user-schema";

export interface CustomRequest extends Request {
  user?: UserDataForTokens;
}
