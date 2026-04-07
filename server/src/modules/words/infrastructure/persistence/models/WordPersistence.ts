import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

export interface ImageAssociationPersistence {
  url: string;
  description?: string;
}

/**
 * Поддокумент перевода в Mongo
 */
export interface WordTranslationPersistence {
  _id: string;
  value: string;
  language: ELangs;
  description?: string;
  difficultyLevel?: ELevels;
  lexicalCategory?: ELexicalCategory;
  image?: ImageAssociationPersistence | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Документ слова в Mongo
 */
export interface WordPersistence {
  _id: string;

  ownerId: string;
  ownerKind: 'user' | 'guest';

  value: string;
  sense?: string; // bank - "финансы" или "берег" (краткая метка для различения)

  language: ELangs;

  translations: WordTranslationPersistence[];

  isPublic: boolean;

  image: ImageAssociationPersistence | null;

  createdAt?: Date;
  updatedAt?: Date;
}
