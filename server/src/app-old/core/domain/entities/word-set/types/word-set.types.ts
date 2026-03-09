import { ELangs, EWordSetVisibility } from '@core/domain/enums';

// export type WordSet = z.infer<typeof wordSetSchema>;
export type WordSet = {
  id?: string; // Идентификатор слова
  title: string; // Оригинальный текст слова;
  description?: string;
  ownerId: string;
  settings: WordSetSettings;
  words: string[];
};

// export type WordSetSettings = z.infer<typeof wordSetSettingsSchema>;
export type WordSetSettings = {
  visibility: EWordSetVisibility;
  passwordHash?: string;
  language: ELangs; // Язык оригинала
  allowCopy: boolean;
};

/**
  const ddd: CreateWordSetDto = {
    title: '',
    description: '',
    settings: { visibility: EWordSetVisibility.Private, language: ELangs.EN, allowCopy: false, passwordHash: '' },
    words: [{ term: '', definition: '' }],
};
 */
