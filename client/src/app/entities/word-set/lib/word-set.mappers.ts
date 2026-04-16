// import { WordSet } from '@entities/word-set';
// import { CreateWordSetDto, UpdateWordSetDto } from '@entities/word-set/api/dtos';
// import { WordItemIsNew } from '@entities/word-set/models/ui/word-item.model';
// import { WordSet } from '@entities/word-set/model/word-set.entity';

/**
 * Преобразует `WordSet<WordItemIsNew>` в DTO для создания (`CreateWordSetDto`).
 * Используется при отправке нового набора слов на сервер.
 *
 * @param wordSet - Набор слов, заполненный в форме пользователем
 * @returns Объект DTO, подходящий для API создания набора слов
 */
// export function mapToCreateDto(wordSet: WordSet<WordItemIsNew>): CreateWordSetDto {
// export function mapToCreateDto(wordSet: WordSet): CreateWordSetDto {
//   return {
//     title: wordSet.title,
//     description: wordSet.description,
//     settings: wordSet.settings,
//     // words: wordSet.words.map((w) => ({
//     //   term: w.term,
//     //   definition: w.definition,
//     // })),
//     words: wordSet.wordIds.map((w) => ({
//       term: w.term,
//       definition: w.definition,
//     })),
//   };
// }

/**
 * Преобразует `WordSet<WordItemIsNew>` в DTO для обновления (`UpdateWordSetDto`).
 * Если слово помечено как новое (`isNew`), его `id` сбрасывается в `null` — это важно для корректной обработки на сервере.
 *
 * @param wordSet - Обновлённый набор слов, включая как существующие, так и новые
 * @returns Объект DTO, подходящий для API обновления набора слов
 */
// export function mapToUpdateDto(wordSet: WordSet<WordItemIsNew>): UpdateWordSetDto {
// export function mapToUpdateDto(wordSet: WordSet): UpdateWordSetDto {
//   return {
//     ...wordSet,
//     words: wordSet.words.map((word) => ({
//       ...word,
//       id: word.isNew ? null : word.id,
//     })),
//   };
// }

/**
 * Мапперы преобразования `WordSet` между формой и DTO.
 */
export const wordSetMapper = {
  // toCreateDto: mapToCreateDto,
  // toUpdateDto: mapToUpdateDto,
};
