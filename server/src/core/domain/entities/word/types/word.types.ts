import { WordTranslation } from '@core/domain/entities';
import { ELangs } from '@core/domain/enums';

/** It must be matched with Word interface
 *  It is the source for database properties */
// export type Word = z.infer<typeof wordSchema>;
export type Word = {
  id?: string;
  owner: string;
  text: string;
  language: ELangs;
  translations: WordTranslation[];

  isPublic: boolean;
  relatedForms: string[];
  sentences: string[];
};

// export type GetWordsResponse = z.infer<typeof getWordsResponse>;
export type GetWordsResponse = {
  data: Word[];
  total: number; // common amount words
};
