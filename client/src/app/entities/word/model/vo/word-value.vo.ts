import { ELangs } from '@shared/enums';

export class WordValue {
  private constructor(
    public readonly value: string,
    language: ELangs,
  ) {
    // console.log('WordValue constructor value', value);
    if (!value.trim()) throw new Error('Word value is required');

    if (!LanguageValidator.isMatch(value, language)) {
      throw new Error(`Text "${value}" does not match language ${language}`);
    }
  }

  static create(value: string, language: ELangs): WordValue {
    // console.log(value);
    return new WordValue(value, language);
  }
}

// TODO move to utils !!!
export class LanguageValidator {
  static isMatch(text: string, language: ELangs): boolean {
    switch (language) {
      case ELangs.UA:
        // return /^[а-яіІїЇєЄґҐ\s]+$/.test(text);
        return /^[АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя0-9\s.!?,:;«»"„“'’()/—–-]+$/.test(
          text,
        );
      // case ELangs.RU:
      //   return /^[а-яёА-ЯЁ]+$/.test(text);
      case ELangs.EN:
        return /^[A-Za-z0-9\s.!?,:;'"()/—–-]+$/.test(text);
    }

    return false;
  }
}
