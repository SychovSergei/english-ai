import { IWord } from '../../core/models/dtos/word.dto';

export interface IWordResponseData {
  totalLength: number;
  data: IWord[];
}
