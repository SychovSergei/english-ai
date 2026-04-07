// import { WordFormValue } from '@features/words/add-word-dialog/model/word-form.types';
import { WordFormValue } from '@features/words';

export type WordActionMode = 'create' | 'edit';

export interface CreateWordDialogData {
  mode: 'create';
  data: null;
}

export interface EditWordDialogData {
  mode: 'edit';
  data: WordFormValue;
  // data: WordDto;
}

export type OpenDialogWordData = CreateWordDialogData | EditWordDialogData;
