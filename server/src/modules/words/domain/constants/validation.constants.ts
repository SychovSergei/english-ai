export const UA_TEXT_PATTERN =
  /^[АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя0-9\s.!?,:;«»"„“'’()/—–-]+$/;

export const EN_TEXT_PATTERN = /^[A-Za-z0-9\s.!?,:;'"()/—–-]+$/;

export const RU_TEXT_PATTERN = /^[А-Яа-яЁё0-9\s.!?,:;«»"„“'’()/—–-]+$/;

export const LANGUAGE_PATTERNS = {
  UA: UA_TEXT_PATTERN,
  EN: EN_TEXT_PATTERN,
  RU: RU_TEXT_PATTERN,
} as const;

export type SupportedLang = keyof typeof LANGUAGE_PATTERNS;
