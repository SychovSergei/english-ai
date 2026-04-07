import { ELangs, ELevels, ELexicalCategory } from '@shared/enums';

// export type WordPatchPayload = Partial<Omit<Word, 'translations'>> & {
//   translations: PatchChange<WordTranslation>;
// };

export type WithId = { id: string };

export type PatchChange<T extends WithId> = {
  created: Omit<T, 'id'>[];
  updated: Partial<T>[];
  deleted: Pick<T, 'id'>[];
};

interface WordBase {
  readonly value: string;
  readonly language: ELangs;
  readonly sense: string | null;
  readonly isPublic: boolean;
  readonly image: {
    url: string;
    description?: string;
  } | null;
}

// entities/word/api/word.dto.ts
export interface WordDto extends WordBase {
  readonly id: string;
  readonly ownerId: string;
  readonly translations: WordTranslationDto[];
  // readonly metadata: WordMetadata;
  // Сервер может присылать дату обновления, но не флаг synced
  readonly updatedAt?: number;
}

// 3. Payload для создания (без ID и OwnerId — их назначит домен/фасад)
// export type CreateWordPayload = WordBase & Omit<WordDto, 'id' | 'ownerId'>;
export type CreateWordPayload = WordBase & {
  translations: Omit<WordTranslationDto, 'id'>[];
};

// Данные для обновления, приходящие из формы
// export type UpdateWordPayload = Omit<WordDto, 'ownerId'>;
export type UpdateWordPayload = WordBase & {
  readonly id: string;
  translations: WordTranslationDto[];
};

// Внутри сущности (модель)
export interface WordMetadata {
  readonly synced: boolean;
  readonly isDeleted: boolean; // Чтобы сущность знала, что она "в корзине"
  // readonly updatedAt: number;
}

export interface WordTranslationDto {
  id: string;
  value: string;
  language: ELangs;
  description?: string;
  difficultyLevel?: ELevels;
  lexicalCategory?: ELexicalCategory;
}

export type CreateWordDto = Omit<WordDto, 'id'>;

export type UpdateWordDto = Partial<WordDto> & { id: string };

export type WordTranslationPayload = WordTranslationDto;
export type UpdateWordTranslationPayload = WordTranslationDto & { id: string };
/****-------------****/

export interface CheckWordRequest {
  word: string;
  // ownerId: string;
  lang: ELangs;
}

export interface CheckWordExistsResponseDto {
  value: string;
  exists: boolean;
  variants: CheckWordVariantResponseDto[];
}

export interface CheckWordVariantResponseDto {
  id: string;
  sense?: string | null;
  translations: string[];
}

export interface CreateWordResponseDto {
  id: string;
  value: string;
  language: ELangs;
  sense: string | null;
  ownerId: string;

  translations: {
    id: string;
    value: string;
    language: ELangs;
    description?: string;
    difficultyLevel?: ELevels;
    lexicalCategory?: ELexicalCategory;
  }[];

  isPublic: boolean;
  image: {
    url: string;
    description?: string;
  };
}
