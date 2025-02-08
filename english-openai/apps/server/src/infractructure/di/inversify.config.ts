import { Container } from "inversify";
import { IEmailService } from "../../core/interfaces/mail-service.interface";
import { TYPES } from "./types";
import { SMTPMailService } from "../services/SmtpMailService";
import { IAuthService } from "../../core/repositories/AuthRepository/AuthRepository";
import { AuthService } from "../../core/services/auth.service";
import { AuthController } from "../controllers/auth-controller";
import { UserService } from "../../core/services/user.service";
import { IUserRepository } from "../../core/repositories/UserRepository/UserRepository";
import { WordController } from "../controllers/Word/word-controller";
import { IUserSettingsService } from "../../core/repositories/UserSettingsRepository/UserSettingsRepository";
import { UserSettingsService } from "../../core/services/user-setting.service";
import { UserSettingsController } from "../controllers/user-settings-controller";
import { WordAppService } from "../../core/services/WordService/WordAppService";
import { ConfigService } from "../config/ConfigService";
import { WordRepository } from "../db/repository/WordRepositoryImpl";

const container = new Container();

// Регистрируем ConfigService как Singleton
container.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();

container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<WordController>(TYPES.WordController).to(WordController);
container.bind<UserSettingsController>(TYPES.UserSettingsController).to(UserSettingsController);

container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IEmailService>(TYPES.EmailService).to(SMTPMailService);
container.bind<IUserRepository>(TYPES.UserService).to(UserService);
container.bind<IUserSettingsService>(TYPES.UserSettingsService).to(UserSettingsService);
container.bind<WordRepository>(TYPES.WordService).to(WordAppService);

export { container };
