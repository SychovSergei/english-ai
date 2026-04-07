import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

// import { AppValidationError, IValidationError } from '@core/domain/errors';
import { AuthError } from '@modules/auth/domain/errors/AuthError';

// import { WordTranslation } from '@modules/words/domain/entities';
import { IdentityProvider } from '@core/application/ports/auth/IdentityProvider';

// import { CreateWordCommand, UpdateWordCommand } from '@modules/words/application/commands';
// import { CheckWordExistsCommand } from '@modules/words/application/commands/CheckWordExistsCommand';
// import { DeleteWordCommand } from '@modules/words/application/commands/DeleteWordCommand';
import { UserUseCases } from '@modules/users/infrastructure/di/UserUseCases';

// import {
//   CheckWordsExistsResponseDTO,
//   WordCheckRequestDto,
// } from '@modules/words/infrastructure/http/dtos/CheckWordsExistsDTO';
// import {
//   CreateWordRequestDto,
//   CreateWordResponseDto,
// } from '@modules/words/infrastructure/http/dtos/CreateWordRequestDTO';
// import { translationHttpMapper } from '@modules/words/infrastructure/http/mappers/TranslationHttpMapper';
// import { WordMapper } from '@modules/words/infrastructure/http/mappers/WordMapper';
import { CORE_TYPES } from '@core/constants/types';
import { USER_TYPES } from '@modules/users/constants/user.types';

@injectable()
export class UserController /* implements WordControllerPort */ {
  constructor(
    @inject(USER_TYPES.UserUseCases) private userUseCases: UserUseCases,
    @inject(CORE_TYPES.IdentityProvider) private identityProvider: IdentityProvider,

    // @inject(WORDS_TYPES.GetActorWordsUseCase) private getUserWordsUseCase: GetActorWordsUseCase,
    // @inject(WORDS_TYPES.CreateWordUseCase) private createWordUseCase: CreateWordUseCase,
    // @inject(WORDS_TYPES.UpdateWordUseCase) private updateWordUseCase: UpdateWordUseCase,
  ) {}

  /**
   *  Get information about user
   * */
  getProfile = async (req: Request, res: Response): Promise<void> => {
    console.log('\x1b[1m\x1b[35m*-*-*-*-*-*- getProfile -*-*-*-*- START -*-*-*-*-*-*-*-*-*-*-*-\x1b[0m');
    console.log(`\x1b[1m\x1b[4m\x1b[35m UserController\x1b[0m ->` + `\x1b[1m\x1b[4m\x1b[31m getProfile \x1b[0m`);

    // const actor = this.identityProvider.getCurrentActor();
    // if (!actor) throw AuthError.Unauthorized();

    const profile = await this.userUseCases.getProfileUC.execute();

    console.log('*-*-*-*-*-*- getProfile -*-*-*-*- END -*-*-*-*-*-*-*-*-*-*-*-');

    res.json(profile);
  };

  //   router.get('/check-exists', async (req: Request, res: Response, next: NextFunction) => {
  //   console.log('check-exists WORD ROUTER');
  //   await wordController.checkWordExists(req, res, next);
  // });

  // checkWordExists = async (req: Request, res: Response): Promise<void> => {
  //   // 1. Принимаем DTO
  //   console.log(`\x1b[1m\x1b[4m\x1b[35m WordController\x1b[0m ->` + `\x1b[1m\x1b[4m\x1b[31m checkWordsExists \x1b[0m`);
  //
  //   const dto: WordCheckRequestDto = req.body;
  //   const { word, lang } = dto;
  //   // if (!Array.isArray(word)) {
  //   //   res.status(400).json({ error: 'Words must be an array' });
  //   // }
  //
  //   console.log('wordText Value/', dto, '/');
  //
  //   // TODO check word value according to lang
  //   const command = CheckWordExistsCommand.create({
  //     value: word,
  //   });
  //
  //   const result = await this.wordUseCases.checkWordExistsUC.execute(command);
  //
  //   const response: CheckWordsExistsResponseDTO[] = result.map((item) => ({
  //     value: item.value,
  //     exists: item.exists,
  //     variants: item.variants.map((v) => ({
  //       id: v.id,
  //       sense: v.sense,
  //       translations: v.translations,
  //     })),
  //   }));
  //
  //   res.status(200).json(response[0]);
  // };

  /**
   *  Create word
   * */
  // createWord = async (req: Request, res: Response): Promise<void> => {
  //   const actor = this.identityProvider.getCurrentActor();
  //   if (!actor) throw AuthError.Unauthorized();
  //   console.log(`\x1b[1m\x1b[4m\x1b[35m WordController\x1b[0m ->` + `\x1b[1m\x1b[4m\x1b[31m createWord \x1b[0m`);
  //
  //   const dto: CreateWordRequestDto = req.body;
  //   const allErrors: IValidationError[] = [];
  //
  //   const translations = dto.translations.map((t, index) => {
  //     const { translation, errors } = translationHttpMapper(t, index);
  //     if (errors.length > 0) allErrors.push(...errors);
  //
  //     return translation;
  //   });
  //
  //   if (allErrors.length > 0) {
  //     throw new AppValidationError('word', allErrors);
  //   }
  //
  //   const command = CreateWordCommand.create({ ...dto, translations: translations });
  //   console.log('WordController -> createWord -> command = ', command);
  //
  //   const word = await this.wordUseCases.createWordUC.execute(command);
  //   console.log('WordController -> createWord -> word = ', JSON.stringify(word, null, 2));
  //   // const word = await this.createWordUseCase.execute(command);
  //
  //   // TODO ????? const response: CreateWordResponseDto = WordMapper.toDto(word);
  //   const response = WordMapper.toResponseDTO(word, actor);
  //
  //   res.status(201).json(response);
  // };

  // updateWord = async (req: Request, res: Response): Promise<void> => {
  //   console.log(
  //     `\x1b[1m\x1b[4m\x1b[35m WordController\x1b[0m ->` + `\x1b[1m\x1b[4m\x1b[31m updateWord \x1b[0m`,
  //     req.params.wordId,
  //     req.body,
  //   );
  //   const actor = this.identityProvider.getCurrentActor();
  //   if (!actor) throw AuthError.Unauthorized();
  //
  //   const command = UpdateWordCommand.create({
  //     id: req.params.wordId,
  //     // Здесь лежит наш UpdateWordRequest
  //     value: req.body.value,
  //     isPublic: req.body.isPublic,
  //     translations: req.body.translations.map((t: WordTranslation) => ({
  //       id: t.id,
  //       value: t.value,
  //       language: t.language,
  //       description: t.description,
  //       difficultyLevel: t.difficultyLevel,
  //       lexicalCategory: t.lexicalCategory,
  //     })),
  //     sense: req.body.sense,
  //     image: req.body.image,
  //   });
  //
  //   const updatedWord = await this.wordUseCases.updateWordUC.execute(command);
  //
  //   // Маппим ответ, передавая актора для учета прав доступа (например, скрытие полей)
  //   const response = WordMapper.toResponseDTO(updatedWord, actor);
  //
  //   res.json(response);
  // };

  // deleteWord = async (req: Request, res: Response): Promise<void> => {
  //   console.log(`\x1b[1m\x1b[4m\x1b[35m WordController\x1b[0m ->` + `\x1b[1m\x1b[4m\x1b[31m deleteWord \x1b[0m`);
  //
  //   const command = DeleteWordCommand.create({
  //     wordId: req.params.id,
  //   });
  //
  //   const word = await this.wordUseCases.deleteWordUC.execute(command);
  //
  //   res.json(word);
  // };
}
