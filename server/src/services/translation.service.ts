import { Types } from "mongoose";

import { ITranslationDto, IWordRequestDto } from "../models/dto/word-dto";
import { ITranslation } from "../models/interfaces/translation.interface";
import { DocResponseWithId } from "../models/interfaces/mongo.interface";
import TranslationModel from "../models/translation.model";
type TranslationsType = IWordRequestDto["translations"];
type TranslationItemType = TranslationsType[number];

class TranslationService {
  async saveTranslation(wordId: Types.ObjectId, translation: TranslationItemType): Promise<Types.ObjectId | null> {
    try {
      // const { language, translatedText, description } = translation;
      const newTranslationId: Types.ObjectId = new Types.ObjectId();
      const newTranslation = {
        _id: newTranslationId,
        wordId: wordId,
        ...translation,
      };
      const newTranslationObject = await TranslationModel.create(newTranslation);
      return newTranslationId;
    } catch (e) {
      //TODO error handler
      return null;
    }
  }

  async getById(id: Types.ObjectId): Promise<ITranslationDto | null> {
    try {
      const transl = (await TranslationModel.findById(id)) as DocResponseWithId<ITranslation> | null; // (Document & ITranslation);
      console.log(transl);
      return transl
        ? ({
            id: transl._id.toString(),
            translatedText: transl.translatedText,
            language: transl.language,
            description: transl.description,
          } as ITranslationDto)
        : null;
    } catch (e) {
      //TODO error handler
      return null;
    }
  }

  // async update(id: string, data: any) {}
}

export default new TranslationService();
