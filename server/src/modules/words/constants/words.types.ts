export const WORDS_TYPES = {
  // Repositories
  WordRepository: Symbol.for('WordRepository'),
  GuestUsageRepository: Symbol.for('GuestUsageRepository'),

  // Services
  GuestWordLimitService: Symbol.for('GuestWordLimitService'),

  // Use Cases
  WordUseCases: Symbol.for('WordUseCases'),
  GetActorWordsUseCase: Symbol.for('GetActorWordsUseCase'),
  CreateWordUseCase: Symbol.for('CreateWordUseCase'),
  CheckWordExistsUseCase: Symbol.for('CheckWordExistsUseCase'),
  UpdateWordUseCase: Symbol.for('UpdateWordUseCase'),
  DeleteWordUseCase: Symbol.for('DeleteWordUseCase'),

  // Controllers and Routers
  WordsRouter: Symbol.for('WordsRouter'),
  WordController: Symbol.for('WordController'),
};
