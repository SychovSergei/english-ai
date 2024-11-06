import { ELangs } from '../../enums/langs.enum';


export interface IWord {
  id: string;
  language: ELangs;
  originalText: string;
  translations: ITranslationDto[];
}

export interface ITranslationDto {
  id: string;
  language: ELangs;
  wordId: string;
  translatedText: string;
  description?: string;
}
