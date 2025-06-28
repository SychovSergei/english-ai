import { Types } from 'mongoose';

import { WordSetSettings } from '@core/domain/entities/word-set';
import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { EWordSetVisibility } from '@core/domain/enums/word-set-visibility.enum';

export interface WordSetDbDto {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  ownerId: Types.ObjectId;
  settings: WordSetSettingsDbDto;
  words: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface WordSetSettingsDbDto {
  visibility: EWordSetVisibility;
  passwordHash?: string;
  language: ELangs;
  allowCopy: boolean;
}

// export interface WordTranslationDbDto {
//   _id?: Types.ObjectId;
//   text: string;
//   language: ELangs;
//   description: string;
//   difficultyLevel: ELevels;
//   lexicalCategory: ELexicalCategory;
// }
