import { Types } from "mongoose";
import TranslationModel from "../models/translation.model";
import { IWordRequestDto } from "../models/dto/word-dto";
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

  // async update(id: string, data: any) {}
}

export default new TranslationService();
