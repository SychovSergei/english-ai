// import { ConfigServicePort } from '@core/application/ports';
import {
  IBcryptService,
  IJwtService,
  ITokenService,
  IUserService,
  IValidationService,
  IVerificationService,
  IWordService,
  IWordSetService,
} from '@core/interfaces';
import { UserSettingsService } from '@core/services';
import { UserService, ValidationService, VerificationService2, WordService } from 'app-old/application/services';
import { AuthService } from 'app-old/application/services/auth.service';
import { WordSetService } from 'app-old/application/services/word-set.service';
import {
  IAuthService,
  ITokenRepositoryService,
  IUserRepositoryService,
  IUserSettingsRepository,
  IUserSettingsService,
  IWordSetRepository,
} from 'app-old/core/repositories';
// import { ConfigService } from 'infrastructure/config/ConfigService';
import {
  TokenRepositoryService,
  UserRepositoryService,
  UserSettingsRepositoryService,
  WordSetRepositoryService,
} from 'app-old/infrastructure/db/repositories';
// import { TYPES } from '@infrastructure/di/types';
import {
  AuthController,
  UserSettingsController,
  WordController,
  WordSetController,
} from 'app-old/infrastructure/http/controllers';
// import { SMTPMailService } from '@infrastructure/notifications/SMTPMailService';
// import { SMTPMailService } from '@infrastructure/mail/smtp-mail.service';
// eslint-disable-next-line boundaries/element-types
import { JwtService } from 'infrastructure/security';
// eslint-disable-next-line boundaries/element-types
import { TokenService } from 'infrastructure/security/token.service';
import { Container } from 'inversify';

import { DiTypes } from '@ioc/di.types';

const container = new Container({ autoBindInjectable: true });

// Регистрируем ConfigService как Singleton
// container.bind<ConfigServicePort>(TYPES.ConfigService).to(ConfigService).inSingletonScope();

container.bind<AuthController>(DiTypes.AuthController).to(AuthController);
container.bind<WordController>(DiTypes.WordController).to(WordController);
container.bind<WordSetController>(DiTypes.WordSetController).to(WordSetController);
container.bind<UserSettingsController>(DiTypes.UserSettingsController).to(UserSettingsController);

// container.bind<IMailService>(DiTypes.MailService).to(SMTPMailService);
container.bind<IAuthService>(DiTypes.AuthService).to(AuthService);
container.bind<IUserService>(DiTypes.UserService).to(UserService);
container.bind<IUserRepositoryService>(DiTypes.UserRepository).to(UserRepositoryService);
container.bind<IUserSettingsService>(DiTypes.UserSettingsService).to(UserSettingsService);
container.bind<IVerificationService>(DiTypes.VerificationService).to(VerificationService2);
// container.bind<IBcryptService>(DiTypes.BcryptService).to(BcryptService);
container.bind<IJwtService>(DiTypes.JwtService).to(JwtService);
container.bind<ITokenService>(DiTypes.TokenService).to(TokenService);
container.bind<IValidationService>(DiTypes.ValidationService).to(ValidationService);
container.bind<IUserSettingsRepository>(DiTypes.UserSettingsRepositoryService).to(UserSettingsRepositoryService);
container.bind<ITokenRepositoryService>(DiTypes.TokenRepositoryService).to(TokenRepositoryService);
// container.bind<IWordRepository>(DiTypes.WordRepository).to(WordRepositoryService);
container.bind<IWordService>(DiTypes.WordService).to(WordService);
container.bind<IWordSetRepository>(DiTypes.WordSetRepository).to(WordSetRepositoryService);
container.bind<IWordSetService>(DiTypes.WordSetService).to(WordSetService);

export { container };
