import { Container } from 'inversify';

import { setupAuthModule } from '@modules/auth/infrastructure/di/auth.container';

export function bootstrapAuthModule(container: Container): void {
  setupAuthModule(container);

  // const authRepo = container.get<AuthRepository>(AUTH_TYPES.AuthRepository);
  // const eventBus = container.get<EventBus>(CORE_TYPES.EventBus);

  // const useCases = {
  //   register: container.get<RegisterUserUseCase>(AUTH_TYPES.RegisterUserUseCase),
  //   login: container.get<LoginUseCase>(AUTH_TYPES.LoginUseCase),
  //   logout: container.get<LogoutUseCase>(AUTH_TYPES.LogoutUseCase),
  //   refresh: container.get<RefreshTokenUseCase>(AUTH_TYPES.RefreshTokenUseCase),
  // };

  // const controller = makeAuthController(useCases);
  // const controller = container.get<AuthController>(AUTH_TYPES.AuthController);
  // const router = makeAuthRouter(controller);
  console.log('Auth Module activated');
  // return container.get<Router>(AUTH_TYPES.AuthRouter);
}
