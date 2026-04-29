import { Container } from 'inversify';

import { setupUserModule } from '@modules/users/infrastructure/di/users.container';

export function bootstrapUserModule(container: Container): void {
  setupUserModule(container);

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
  console.log('User Module activated');
  // return container.get<Router>(AUTH_TYPES.AuthRouter);
}
