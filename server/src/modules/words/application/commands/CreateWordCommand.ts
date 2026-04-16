import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { AppValidationError } from '@core/domain/errors';

export interface CreateWordPayload {
  id: string;

  value: string;
  language: ELangs;
  sense: string | null;
  translations: CreateTranslationPayload[];
  isPublic?: boolean;
  image: ImageAssociationPayload | null;
}

export interface CreateTranslationPayload {
  id: string;
  value: string;
  language: ELangs;
  description: string;
  difficultyLevel: ELevels;
  lexicalCategory: ELexicalCategory;
}

interface ImageAssociationPayload {
  url: string;
  description?: string;
}

export class CreateWordCommand {
  readonly id: string;

  readonly value: string;
  readonly language: ELangs;
  readonly sense: string | null;
  readonly translations: CreateTranslationPayload[];
  readonly isPublic: boolean;
  readonly image: ImageAssociationPayload | null;

  private constructor(payload: CreateWordPayload) {
    if (!payload.value?.trim()) {
      throw new Error('Word value is required');
    }
    if (!payload.id) {
      throw new Error('Word ID is required');
    }

    this.id = payload.id;

    this.value = payload.value;
    this.language = payload.language;
    this.sense = payload.sense ?? null;
    this.translations = payload.translations ?? [];
    this.isPublic = payload.isPublic ?? false;
    this.image = payload.image;
  }

  static create(payload: CreateWordPayload): CreateWordCommand {
    // TODO: Could be used for validation (e.g., using Zod)

    if (!payload.value?.trim()) throw AppValidationError.singleField('word', 'value', 'Word value is required');
    if (payload.translations.length === 0)
      throw AppValidationError.singleField(
        'word',
        'translations',
        'Translations cant be empty, at least one is required',
      );

    return new CreateWordCommand(payload);
  }
}
