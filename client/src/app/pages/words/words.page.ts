import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'words-page',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordsPage {
  // filterId = 'word-data-table-filter';
}
