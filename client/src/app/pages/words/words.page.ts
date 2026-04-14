import { WordManagementComponent } from '@widgets/word-management';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'words-page',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WordManagementComponent],
})
export class WordsPage {
  // filterId = 'word-data-table-filter';
}
