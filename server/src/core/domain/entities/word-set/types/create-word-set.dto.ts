import { WordSetSettings } from '@core/domain/entities';
import { ELangs, EWordSetVisibility } from '@core/domain/enums';

// export type CreateWordSetDto = z.infer<typeof createWordSetDtoSchema>;
export type CreateWordSetDto = {
  title: string; // Оригинальный текст слова;
  description?: string;
  settings: WordSetSettings;
  words: CreateWordSetWordDto[];
};

// export type CreateWordSetWordDto = z.infer<typeof createWordSetWordDtoSchema>;
export type CreateWordSetWordDto = Pick<WordSetWordItem, 'term' | 'definition' | 'isNew'>;

export type UpdateWordSetWordDto = WordSetWordItem;

// export type UpdateWordSetWordDto = z.infer<typeof updateWordSetWordDtoSchema>;

export interface UpdateWordSetDto {
  id: string;
  title: string;
  description: string;
  ownerId: string; // TODO ?????
  settings: {
    visibility: EWordSetVisibility;
    passwordHash?: string;
    language: ELangs;
    allowCopy: boolean;
  };
  words: UpdateWordSetWordDto[];
}

export interface WordSetWordItem {
  id?: string;
  term: string;
  definition: string;
  isNew: string;
}
