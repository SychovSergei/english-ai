export const DiTypes = {
  ConfigService: Symbol.for('ConfigService'),

  AuthController: Symbol.for('AuthController'),
  WordController: Symbol.for('WordController'),
  WordSetController: Symbol.for('WordSetController'),
  UserSettingsController: Symbol.for('UserSettingsController'),

  AuthService: Symbol.for('AuthService'),

  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),

  UserSettingsService: Symbol.for('UserSettingsService'),
  UserSettingsRepositoryService: Symbol.for('UserSettingsRepositoryService'),

  WordService: Symbol.for('WordService'),
  WordRepository: Symbol.for('WordRepository'),

  WordSetService: Symbol.for('WordSetService'),
  WordSetRepository: Symbol.for('WordSetRepository'),

  VerificationService: Symbol.for('VerificationService'),
  MailService: Symbol.for('MailService'),
  ValidationService: Symbol.for('ValidationService'),

  BcryptService: Symbol.for('BcryptService'),
  JwtService: Symbol.for('JwtService'),

  TokenService: Symbol.for('TokenService'),
  TokenRepositoryService: Symbol.for('TokenRepositoryService'),
};
