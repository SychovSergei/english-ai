import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';
import { AppValidationError, IValidationError } from '@core/domain/errors';
import { LANGUAGE_PATTERNS, SupportedLang } from '@modules/words/domain/constants/validation.constants';

import { CreateTranslationPayload } from '@modules/words/application/commands';

import { IWordTranslationDTO } from '@modules/words/infrastructure/http/dtos/CreateWordRequestDTO';

/**
 * Transform HTTP translation data to internal format Command
 */
export function translationHttpMapper(
  dto: IWordTranslationDTO,
  index: number,
): { translation: CreateTranslationPayload; errors: IValidationError[] } {
  // validateAlphabet(dto.value.trim(), dto.language);
  const errors: IValidationError[] = [];
  console.log('translationHttpMapper -> dto', dto);
  const value = dto.value.trim();
  if (!value) {
    errors.push({ path: ['translations', index, 'value'], message: 'Translation value is required' });
  } else {
    const lang = dto.language;

    if (!validateAlphabet(value, lang)) {
      errors.push({ path: ['translations', index, 'value'], message: `Value does not match ${lang} alphabet` });
    }
    // validateAlphabet(value, dto.language);
  }
  console.log('errors======', errors);
  // Если набрались ошибки — выбрасываем их пачкой
  if (errors.length > 0) {
    throw new AppValidationError('translations', errors);
  }

  return {
    translation: {
      id: dto.id,
      value: dto.value,
      language: dto.language || ELangs.UA,
      description: dto.description || '',
      difficultyLevel: dto.difficultyLevel || ELevels.Empty,
      lexicalCategory: dto.lexicalCategory || ELexicalCategory.Empty,
    },
    errors,
  };
}

function validateAlphabet(text: string, lang: ELangs): boolean {
  console.log('validateAlphabet', text, lang);
  // const pattern = patterns[lang];
  const pattern = LANGUAGE_PATTERNS[lang.toUpperCase() as SupportedLang];
  // if (pattern && !pattern.test(text)) {
  //   throw new AppValidationError(`Text "${text}" does not match the alphabet for language "${lang}".`);
  // }
  console.log('validateAlphabet', pattern, !pattern.test(text));
  if (!pattern) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  return pattern.test(text);
}
