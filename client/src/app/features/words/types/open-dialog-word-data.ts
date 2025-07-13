import { WordFormValue } from '@features/words/add-word-dialog/model/word-form.types';

export type WordActionMode = 'create' | 'edit';

export interface CreateWordDialogData {
  mode: 'create';
  data: null;
}

export interface EditWordDialogData {
  mode: 'edit';
  data: WordFormValue;
}

export type OpenDialogWordData = CreateWordDialogData | EditWordDialogData;
