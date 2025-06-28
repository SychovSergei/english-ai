import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { Word, WordSet } from '@core/domain/entities';
import { WordDbDto } from '@core/domain/entities/word';
import { CreateWordSetDto, UpdateWordSetDto } from '@core/domain/entities/word-set/types/create-word-set.dto';
import { IWordService, IWordSetService } from '@core/interfaces';
import { IUserSettingsService, IWordRepository, IWordSetRepository } from '@core/repositories';
import { WordMapper } from '@application/mappers/word.mapper';
import { WordSetMapper } from '@application/mappers/word-set.mapper';

/** TODO БИЗНЕС ЛОГИКА
 *   (Любые методы) */
@injectable()
export class WordSetService implements IWordSetService {
  constructor(
    @inject(DiTypes.WordRepository) private wordRepository: IWordRepository,
    @inject(DiTypes.UserSettingsService) private userSettingsService: IUserSettingsService,
    @inject(DiTypes.WordService) private wordService: IWordService,
    @inject(DiTypes.WordSetRepository) private wordSetRepository: IWordSetRepository,
  ) {}

  async createWordSet(dto: CreateWordSetDto, userId: string): Promise<WordSet> {
    // const userSettings = await this.userSettingsService.getSettings(userId); //TODO может отсюда взять данные?
    // const createdWord = await this.wordRepository.createWord(wordDbDto);
    // wordsIds.push(createdWord.id?);

    console.log('createWordSet dto:', dto);

    const wordsPromises: Promise<Word>[] = [];
    for (const wordDto of dto.words) {
      const word: Word = WordMapper.toDomainFromCreateBasic(wordDto, userId);
      const wordDbDto: WordDbDto = WordMapper.toEntity(word);
      wordsPromises.push(this.wordRepository.createWord(wordDbDto));
    }
    const words = await Promise.allSettled(wordsPromises);

    const successful: { index: number; word: Word }[] = [];
    const failed: { index: number; reason: any }[] = [];

    for (const [index, result] of words.entries()) {
      if (result.status === 'fulfilled') {
        successful.push({ index, word: result.value });
      } else {
        failed.push({ index, reason: result.reason });
      }
    }

    if (failed.length > 0) {
      console.warn(
        'Некоторые слова не были сохранены:',
        failed.map((f) => f.reason.message),
      );
    }

    const wordsIds = successful.map(({ word }) => word.id || 'empty');
    console.log(wordsIds);

    const wordSetDomain = WordSetMapper.toDomainFromCreate(dto, userId, wordsIds);
    const wordSetEntity = WordSetMapper.toEntity(wordSetDomain);

    const wordSetCreated = await this.wordSetRepository.createWordSet(wordSetEntity);
    console.log('Попытка сохранить удачная');

    return wordSetCreated;
  }

  // TODO нуден ли id WordSet
  async updateWordSet(dto: UpdateWordSetDto, userId: string): Promise<WordSet> {
    const { id, title, words } = dto;
    if (!id) {
      // throw WordSetError.NotFound(title);// TODO ?????
    }

    // 1) Превратить данные в domain сущность
    // 2) Превратить данные в Entity DB сущность
    // 3) Обновить данные в Mongo

    const wordsPromises: Promise<Word>[] = [];
    for (const wordDto of dto.words) {
      const word: Word = WordMapper.toDomainFromCreateBasic(wordDto, userId);
      const wordDbDto: WordDbDto = WordMapper.toEntity(word);
      wordsPromises.push(this.wordRepository.createWord(wordDbDto));
    }

    // const existingWordSet = await this.wordSetRepository.findById(id.toString());
    //
    // // const existingWord = await this.wordService.findWord(userId, id.toString());
    // if (!existingWord) {
    //   throw WordError.NotFound(text);
    // }
    // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // if (existingWord!.owner!.toString() !== userId) {
    //   throw WordError.AccessDenied('Update word error: incorrect user id.');
    // }
    //
    // // 1. Update main word mean
    // existingWord.text = text;
    // // 2. Обрабатываем массив translations
    // const updatedTranslations = translations.map((translation) => {
    //   return translation.id
    //     ? translation
    //     : {
    //         ...translation,
    //         id: new Types.ObjectId(),
    //       };
    // });
    // // Remove old translations, which is absented in new tanslations
    // const newTranslationIds = updatedTranslations.map((t) => t.id?.toString());
    // existingWord.translations = existingWord.translations.filter((t) => newTranslationIds.includes(t.id?.toString()));
    // // Update or add new translations
    // updatedTranslations.forEach((newTranslation) => {
    //   const index = existingWord.translations.findIndex((t) => t.id?.toString() === newTranslation.id?.toString());
    //   if (index === -1) {
    //     existingWord.translations.push(newTranslation);
    //   } else {
    //     existingWord.translations[index] = {
    //       ...existingWord.translations[index],
    //       ...newTranslation,
    //     };
    //   }
    // });
    // // Save updated document
    // const updatedWord = await this.wordRepository.updateWord(userId, existingWord);
    // console.log(updatedWord);

    return {} as WordSet;
  }
}
