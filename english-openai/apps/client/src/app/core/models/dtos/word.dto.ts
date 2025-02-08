// import { ELangs } from '../../enums/langs.enum';
// import { Identifiable } from '../../../shared/components/table/table.component';
//
// export interface BaseWordDto<T> {
//   language: ELangs;
//   originalText: string;
//   translations: T[];
// }
//
// export interface BaseTranslation {
//   language: ELangs;
//   translatedText: string;
//   description: string;
// }
//
// export interface TranslationResponseDto extends BaseTranslation {
//   id: string;
// }
//
// export type WordRequestDto = BaseWordDto<BaseTranslation>;
//
// export interface WordResponseDto extends BaseWordDto<TranslationResponseDto>, Identifiable {
//   // id: string;
// }
//
// export class WordDto implements BaseWordDto<BaseTranslation> {
//   language: ELangs;
//   originalText: string;
//   translations: BaseTranslation[];
//
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   constructor(data: any) {
//     this.language = data.language;
//     this.originalText = data.originalText;
//     this.translations = data.translations;
//   }
// }
