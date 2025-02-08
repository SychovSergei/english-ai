import { NextFunction, Request, Response } from "express";

import { Validation } from "../services/validator";

import { userSettingsSchema } from "../db/entities/schemas/user-settings-schema";
import { SharedUserUpdateSettings } from "@shared/interfaces/user-settings.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IUserSettingsService } from "../../core/repositories/UserSettingsRepository/UserSettingsRepository"; //TODO изменить путь интерфейса (из схемы)

@injectable()
export class UserSettingsController {
  constructor(@inject(TYPES.UserSettingsService) private userSettingsService: IUserSettingsService) {}

  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(">> SettingsController getSettings");
      const settings = await this.userSettingsService.getSettings();
      res.status(200).json(settings);
    } catch (e) {
      return next(e);
    }
  }

  async createSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(">> SettingsController createSettings", req.body);
      const settings = await this.userSettingsService.createSetting();
      res.status(200).json(settings);
    } catch (e) {
      return next(e);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settingValidatedData = Validation.validate<SharedUserUpdateSettings>(
        req.body,
        userSettingsSchema,
        "setting",
      );
      const updatedSettings = await this.userSettingsService.updateSettings(settingValidatedData);

      res.status(200).json(updatedSettings);
    } catch (e) {
      return next(e);
    }
  }
}
