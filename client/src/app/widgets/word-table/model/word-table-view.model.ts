export interface WordTableVm {
  id: string;
  wordValue: string; // Для сортировки по алфавиту
  translations: string[];
  mainTranslation: string;
  translationsCount: number;
  synced: boolean;
  updatedAt: number;
  // Сюда можно добавить стили или иконки, специфичные для UI
}
