import { ELangs } from '@core/domain/enums';

interface UserBase {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly isActivated: boolean;
}

export interface UserSettingsDto {
  readonly defaultLanguage: ELangs;
  readonly translationLanguage: ELangs;
  readonly interfaceLanguage: ELangs;
}

export interface UserDto extends UserBase {
  readonly id: string;

  readonly role: string;
  readonly settings: UserSettingsDto;
  readonly updatedAt?: number;
}

// export interface WordResponseDto {
//   id: string;
//   value: string;
//   language: ELangs;
//   sense?: string | null;
//   ownerId: string;
//   translations: WordTranslationDto[];
//   image?: ImageAssociationDto;
//   updatedAt: number; // Обязательно для синхронизации!
//
//   // Поля только для зарегистрированных (Student/Teacher/Admin)
//   progress?: {
//     mastery: number; // 0-100% процент выучености
//     nextReviewDate: Date;
//   };
//
//   // Поля для управления (Teacher/Admin)
//   isPublic?: boolean;
//   creatorId?: string;
//   createdAt?: Date;
//
//   // Служебные поля для Admin
//   usageCount?: number; // Как часто ChatGPT использовал это слово
// }

// export interface UserDto {
//   id: string;
//   value: string;
//   language: ELangs;
//   sense?: string | null;
//   ownerId: string;
//
//   translations: WordTranslationDto[];
//
//   isPublic: boolean;
//   image?: ImageAssociationDto;
//
//   updatedAt: number; // Обязательно добавь для синхронизации!
// }
//
// export interface WordTranslationDto {
//   id: string;
//   value: string;
//   language: ELangs;
//   description?: string;
//   difficultyLevel?: ELevels;
//   lexicalCategory?: ELexicalCategory;
// }

// interface ImageAssociationDto {
//   url: string;
//   description?: string;
// }
