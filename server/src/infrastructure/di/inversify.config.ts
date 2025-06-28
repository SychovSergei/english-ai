import { DiTypes } from '@shared/types';
import { Container } from 'inversify';

import {
  IBcryptService,
  IJwtService,
  IMailService,
  ITokenService,
  IUserService,
  IValidationService,
  IVerificationService,
  IWordService,
  IWordSetService,
} from '@core/interfaces';
import {
  IAuthService,
  ITokenRepositoryService,
  IUserRepositoryService,
  IUserSettingsRepository,
  IUserSettingsService,
  IWordRepository,
  IWordSetRepository,
} from '@core/repositories';
import { TokenService, UserSettingsService } from '@core/services';
import { IConfigService } from '@application/ports/config-service.interface';
import { AuthService, UserService, ValidationService, VerificationService2, WordService } from '@application/services';
import { WordSetService } from '@application/services/word-set.service';
import { ConfigService } from '@infrastructure/config/config.service';
import {
  TokenRepositoryService,
  UserRepositoryService,
  UserSettingsRepositoryService,
  WordRepositoryService,
  WordSetRepositoryService,
} from '@infrastructure/db/repositories';
// import { TYPES } from '@infrastructure/di/types';
import {
  AuthController,
  UserSettingsController,
  WordController,
  WordSetController,
} from '@infrastructure/http/controllers';
// import { SMTPMailService } from '@infrastructure/mail/smtp-mail.service';
import { BcryptService, JwtService } from '@infrastructure/security';
import { SMTPMailService } from '@infrastructure/services/mail/smtp-mail.service';

const container = new Container();

// Регистрируем ConfigService как Singleton
// container.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
// container.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
container.bind<IConfigService>(DiTypes.ConfigService).to(ConfigService).inSingletonScope();

container.bind<AuthController>(DiTypes.AuthController).to(AuthController);
container.bind<WordController>(DiTypes.WordController).to(WordController);
container.bind<WordSetController>(DiTypes.WordSetController).to(WordSetController);
container.bind<UserSettingsController>(DiTypes.UserSettingsController).to(UserSettingsController);

container.bind<IMailService>(DiTypes.MailService).to(SMTPMailService);
container.bind<IAuthService>(DiTypes.AuthService).to(AuthService);
container.bind<IUserService>(DiTypes.UserService).to(UserService);
container.bind<IUserRepositoryService>(DiTypes.UserRepository).to(UserRepositoryService);
container.bind<IUserSettingsService>(DiTypes.UserSettingsService).to(UserSettingsService);
container.bind<IVerificationService>(DiTypes.VerificationService).to(VerificationService2);
container.bind<IBcryptService>(DiTypes.BcryptService).to(BcryptService);
container.bind<IJwtService>(DiTypes.JwtService).to(JwtService);
container.bind<ITokenService>(DiTypes.TokenService).to(TokenService);
container.bind<IValidationService>(DiTypes.ValidationService).to(ValidationService);
container.bind<IUserSettingsRepository>(DiTypes.UserSettingsRepositoryService).to(UserSettingsRepositoryService);
container.bind<ITokenRepositoryService>(DiTypes.TokenRepositoryService).to(TokenRepositoryService);
container.bind<IWordRepository>(DiTypes.WordRepository).to(WordRepositoryService);
container.bind<IWordService>(DiTypes.WordService).to(WordService);
container.bind<IWordSetRepository>(DiTypes.WordSetRepository).to(WordSetRepositoryService);
container.bind<IWordSetService>(DiTypes.WordSetService).to(WordSetService);

export { container };
