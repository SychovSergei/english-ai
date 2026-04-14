import { IdentifyGuestUseCase } from '@modules/auth/application/use-cases/IdentifyGuestUseCase';

export const AUTH_TYPES = {
  // ActorResolver: Symbol.for('ActorResolver'),
  TokenVerifier: Symbol.for('TokenVerifier'),
  TokenService: Symbol.for('TokenService'),

  JwtSecret: Symbol.for('JwtSecret'),

  AuthService: Symbol.for('AuthService'),

  // Repositories
  // AuthRepository: Symbol.for('AuthRepository'),
  GuestRepository: Symbol.for('GuestRepository'),
  UserRepository: Symbol.for('UserRepository'),
  SessionModel: Symbol.for('SessionModel'),
  SessionRepository: Symbol.for('SessionRepository'),

  // Controllers and Routers
  AuthRouter: Symbol.for('AuthRouter'),
  AuthController: Symbol.for('AuthController'),

  // Use Cases
  IdentifyGuestUseCase: Symbol.for('IdentifyGuestUseCase'),
  RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  RefreshTokenUseCase: Symbol.for('RefreshTokenUseCase'),
};
