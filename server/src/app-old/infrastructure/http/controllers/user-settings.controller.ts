import { IValidationService } from '@core/interfaces';
import { IUserSettingsService } from '@core/repositories';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { UserSettings, userSettingsSchema } from '@core/domain/entities';

import { DiTypes } from '@ioc/di.types';

@injectable()
export class UserSettingsController {
  constructor(
    @inject(DiTypes.UserSettingsService) private userSettingsService: IUserSettingsService,
    @inject(DiTypes.ValidationService) private validationService: IValidationService,
  ) {}

  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('>> SettingsController getSettings');
      //TODO где взять ID????
      const settings = await this.userSettingsService.getSettings('671eb1d9588c00c5a7fd91a5');
      res.status(200).json(settings);
    } catch (e) {
      return next(e);
    }
  }

  async createSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('>> SettingsController createSettings', req.body);
      const settings = await this.userSettingsService.createSetting();
      res.status(200).json(settings);
    } catch (e) {
      return next(e);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settingValidatedData = this.validationService.validate<UserSettings>(
        req.body,
        userSettingsSchema,
        'setting',
      );
      const updatedSettings = await this.userSettingsService.updateSettings(settingValidatedData);

      res.status(200).json(updatedSettings);
    } catch (e) {
      return next(e);
    }
  }
}
