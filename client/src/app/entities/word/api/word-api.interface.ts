// import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
// import {
//   DeleteWordResponse,
//   Word,
//   WordIdResponse,
//   WordsRequest,
//   WordTranslation,
// } from '@entities/word/model/word.types';
//
// import { Observable } from 'rxjs';
// import { CreateWordDTO, UpdateWordDTO } from '@features/words/ui/add-word-dialog/model/add-word.types';
//
// export interface WordApiInterface {
//   // getWords(requestObj: WordsRequest): Observable<WordsResponse>;
//   getWords(requestObj: WordsRequest): Observable<WordsResponseDTO>;
//
//   // filterWords(reqObj: WordsRequest): Observable<WordsResponse>;
//   checkWord(wordValue: string): Observable<WordIdResponse>;
//   createWord(data: CreateWordDTO): Observable<Word>;
//   updateWord(id: string, data: UpdateWordDTO): Observable<Word>;
//
//   getWordById(wordId: string): Observable<Word>;
//   deleteWord(id: string): Observable<DeleteWordResponse>;
//
//   addTranslation(id: string, data: WordTranslation): Observable<WordTranslation>;
// }
