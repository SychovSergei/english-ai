import { ELangs } from '@core/domain/enums';
import { OwnerId } from '@core/domain/identity/OwnerId';
import { CreateWordTranslationsProps } from '@modules/words/domain/contracts/CreateWordTranslationProps';
import { ImageAssociation, WordId } from '@modules/words/domain/value-objects';

export interface CreateWordProps {
  id: WordId; // 👈 id is coming from outside (use case)
  value: string;
  owner: OwnerId;
  language: ELangs;
  sense: string | null;
  translations: CreateWordTranslationsProps[];
  isPublic: boolean;
  image: ImageAssociation | null;
}
