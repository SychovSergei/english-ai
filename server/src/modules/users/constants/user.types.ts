export const USER_TYPES = {
  // Repositories
  UsersRepository: Symbol.for('UsersRepository'),

  // Use Cases
  UserUseCases: Symbol.for('UserUseCases'),
  GetUserProfileUseCase: Symbol.for('GetUserProfileUseCase'),
  // CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  // UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),

  // Controllers and Routers
  UsersRouter: Symbol.for('UsersRouter'),
  UsersController: Symbol.for('UsersController'),
};
