import { ELangs } from '@core/domain/enums';

export interface WordCheckRequestDto {
  word: string;
  lang: ELangs;
}

export interface CheckWordsExistsResponseDTO {
  value: string;
  exists: boolean;
  variants: CheckWordVariantResponseDTO[];
}

export interface CheckWordVariantResponseDTO {
  id: string;
  sense?: string | null;
  translations: string[];
}
