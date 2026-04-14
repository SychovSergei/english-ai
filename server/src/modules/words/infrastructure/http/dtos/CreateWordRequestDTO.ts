import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

export interface CreateWordRequestDto {
  id: string;
  value: string;
  language: ELangs;
  sense: string | null;

  translations: IWordTranslationDTO[];

  isPublic: boolean;
  image: ImageAssociationDTO;
}

// export interface DeleteWordRequestDto {
//   id: string;
// }

export interface IWordTranslationDTO {
  id: string;
  value: string;
  language: ELangs;
  description?: string;
  difficultyLevel?: ELevels;
  lexicalCategory?: ELexicalCategory;
}

interface ImageAssociationDTO {
  url: string;
  description?: string;
}

export interface CreateWordResponseDto {
  id: string;
  value: string;
  language: ELangs;
  sense: string | null;
  ownerId: string;

  translations: IWordTranslationDTO[];

  isPublic: boolean;
  image: ImageAssociationDTO;
}
