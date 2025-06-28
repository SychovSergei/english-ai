import { Types } from 'mongoose';
import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { GetWordsResponse, Word, WordTranslation } from '@core/domain/entities';
import { CreateWordDto, UpdateWordDto } from '@core/domain/entities/word/types/create-word.dto';
import { WordDbDto } from '@core/domain/entities/word/types/word-db.dto';
import { WordError } from '@core/domain/errors/word.error';
import { IValidationService, IWordService, TableCommonParamsRequest } from '@core/interfaces';
import { IWordRepository } from '@core/repositories';
import { WordMapper } from '@application/mappers/word.mapper';

/** БИЗНЕС ЛОГИКА
 *  (Любые методы) */
@injectable()
export class WordService implements IWordService {
  constructor(
    @inject(DiTypes.WordRepository) private wordRepository: IWordRepository,
    @inject(DiTypes.ValidationService) private validationService: IValidationService,
  ) {}

  async getAll(userId: string, options: TableCommonParamsRequest): Promise<GetWordsResponse> {
    const res: GetWordsResponse = await this.wordRepository.getAllForUser(userId, options);
    return res;

    // // const words = await UserWordModel.find({ owner: userId });
    // const words: Word[] | null = await this.wordRepository.findById(userId);
    // if (!words) {
    //   throw WordError.NotFound();
    // }
    //
    // // for (const word of words) {
    // //   const wordDto = new WordResponseDTO(word._id.toString(), word.text, word.language);
    // //   await wordDto.loadTranslations(word.translations, translationService.getById);
    // //   wordDtos.push(wordDto);
    // // }
    // // console.log("words------", words);
    // const wordsFormated = words.map((word) => {
    //   const wordObj = word;
    //   const newTranslations: WordTranslation[] = wordObj.translations.map((translation) => {
    //     const { _id, ...rest } = translation;
    //     return {
    //       ...rest,
    //       id: _id?.toString(),
    //     };
    //   });
    //   const { _id, ...rest } = wordObj;
    //   const resWord: Word = {
    //     ...rest,
    //     owner: wordObj.owner!.toString(),
    //     translations: newTranslations,
    //     id: _id?.toString() || wordObj.id!.toString(),
    //   };
    //
    //   return resWord;
    // });
    //
    // // console.log("wordsFormated =", wordsFormated);
    // return {
    //   total: wordsFormated.length,
    //   data: wordsFormated,
    // };
  }

  async findById(wordId: string): Promise<Word> {
    console.log('findById word ID =====', wordId);

    const word: Word | null = await this.wordRepository.findById(wordId); //.lean().exec(); // as DocResponseWithId<Word>[];

    if (!word) {
      throw WordError.NotFound(wordId);
    }

    // const wordObject = word.toObject();
    console.log('<<<<<', word, '>>>>>');
    // const newTranslations: WordTranslation[] = word.translations.map((translation) => {
    //   const { _id, ...rest } = translation;
    //   return {
    //     ...rest,
    //     id: _id?.toString(),
    //   };
    // });
    // const wordObj: Word = {
    //   id: word.id?.toString() || word._id?.toString(),
    //   text: word.text,
    //   language: word.language,
    //   owner: word.owner,
    //   isPublic: word.isPublic,
    //   // translations: newTranslations,
    //   translations: word.translations,
    //   relatedForms: word.relatedForms,
    //   sentences: word.sentences,
    //   createdAt: word.createdAt,
    // };
    // console.log(">>>>>>>>> wordObj", wordObj);

    // return wordObj;
    return word;
  }

  async findByValue(userId: string, wordValue: string): Promise<Word | null> {
    /** const word = await word-model.findOne({ text: wordValue })
      .populate({
        path: "owner", // Связанное поле
        match: { _id: userId }, // Условие фильтрации
        select: "id", // Поля, которые нужно вернуть
      })
      .exec();
    const wordObject = word?.toObject(); */
    const wordObject = await this.wordRepository.findByValue(userId, wordValue);

    console.log('wordObject =======', wordObject ?? 'слова нет');
    if (wordObject) {
      console.log('wordObject id =======', wordObject?.id ?? 'id нет');
      console.log('wordObject owner =======', wordObject?.owner ?? 'owner нет');
    }
    console.log('--wordObject---', wordObject);
    return wordObject;
  }

  async addTranslation(userId: string, wordId: string, newTransl: WordTranslation): Promise<Word> {
    //TODO validation initial data - WordTranslation
    const newTranslation: WordTranslation = {
      id: new Types.ObjectId().toString(),
      text: newTransl.text,
      language: newTransl.language,
      description: newTransl.description,
      lexicalCategory: newTransl.lexicalCategory,
      difficultyLevel: newTransl.difficultyLevel,
    };

    const word = await this.wordRepository.findById(wordId);
    if (!word) {
      throw WordError.NotFound();
    }

    if (word.translations.some((item) => item.text === newTranslation.text)) {
      throw WordError.BadRequest('translation', 'Translation already exists!');
    }

    const updatedWord = await this.wordRepository.addTranslation(userId, wordId, newTranslation);

    if (!updatedWord) {
      throw WordError.NotFound();
    }

    return updatedWord;
  }

  // async createNewWord(userId: string, newWordDto: CreateWordDto) {
  async createWord(userId: string, wordDto: CreateWordDto): Promise<Word> {
    /** сохраняем каждое значение перевода и возвращаем их id */
    // const translationErrors: string[] = [];
    // const translationIds: Awaited<Types.ObjectId | null>[] = await Promise.all(
    //   newWordDto.translations.map(async (translateItem) => {
    //     try {
    //       const translationId: Types.ObjectId | null = await translationService.saveTranslation(
    //         newWordId,
    //         translateItem,
    //       );
    //       if (translationId === null) {
    //         translationErrors.push(translateItem.text);
    //       }
    //       return translationId;
    //     } catch (error) {
    //       translationErrors.push(translateItem.text);
    //       return null; // return `null` to continue save other translations
    //     }
    //   }),
    // );
    // if (translationErrors.length) {
    //   //TODO надо передать пользователю какие слова не удалось сохранить
    // }
    // const translationIdsFiltered = translationIds.filter((id): id is Types.ObjectId => id !== null);

    // const newWordData: Word = {
    //   owner: userId,
    //   isPublic: false,
    //   text: newWordDto.text,
    //   language: newWordDto.language,
    //   // description: newWordDto.description,
    //   relatedForms: newWordDto.relatedForms,
    //   difficultyLevel: newWordDto.difficultyLevel,
    //   translations: newWordDto.translations,
    //   sentences: newWordDto.sentences,
    //   createdAt: new Date(),
    // };
    // this.validationService.validate<AddWordDTO>(newWordData, addWordDTOSchema, "word");

    // wordDto.translations = wordDto.translations.map((translItem) => {
    //   const newId = new Types.ObjectId();
    //   translItem._id = newId;
    //   translItem.id = newId.toString();
    //   return translItem;
    // });
    // console.log('Попытка сохранить', newWordData);
    // this.validationService.validate<CreateWordDto>(newWordData, addWordDTOSchema, 'word');
    // const newWordCreated: Word = (await UserWordModel.create(newWordData)).toObject(); //: DocResponseWithId<Word>

    const word = await this.findByValue(userId, wordDto.text.trim());
    if (word) {
      console.log('wordDoc', word);
      console.log('ERRORRRR, id = ', word.id);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      throw WordError.AlreadyExists<{ id: string }>(word.text, { id: word.id!.toString() });
    }

    const wordDomain: Word = WordMapper.toDomainFromCreateFull(wordDto, userId);
    const wordDbDto: WordDbDto = WordMapper.toEntity(wordDomain);
    const newWordCreated = await this.wordRepository.createWord(wordDbDto); //.toObject(); //: DocResponseWithId<Word>
    console.log('Попытка сохранить удачная');

    return newWordCreated;
    // }
  }

  async updateWord(userId: string, updates: UpdateWordDto): Promise<Word> {
    const { id, text, translations } = updates;
    if (!id) {
      throw WordError.NotFound(text);
    }

    // Проверяем, что основной объект существует
    const existingWord = await this.wordRepository.findById(id.toString());

    // const existingWord = await this.wordService.findWord(userId, id.toString());
    if (!existingWord) {
      throw WordError.NotFound(text);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (existingWord!.owner!.toString() !== userId) {
      throw WordError.AccessDenied('Update word error: incorrect user id.');
    }

    // 1. Update main word mean
    existingWord.text = text;
    // 2. Обрабатываем массив translations
    const updatedTranslations = translations.map((translation) => {
      return translation.id
        ? translation
        : {
            ...translation,
            id: new Types.ObjectId(),
          };
    });
    // Remove old translations, which is absented in new tanslations
    const newTranslationIds = updatedTranslations.map((t) => t.id?.toString());
    existingWord.translations = existingWord.translations.filter((t) => newTranslationIds.includes(t.id!.toString()));
    // Update or add new translations
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

    // Save updated document
    // const updatedWord = await existingWord.save();
    // const wordData: Word = updatedWordId;

    // const updatedWord = await this.wordRepository.updateWord(userId, existingWord);
    // console.log(updatedWord);

    return {} as Word;
  }
}
