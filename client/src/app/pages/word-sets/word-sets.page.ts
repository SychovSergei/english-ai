import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-word-set-page',
  templateUrl: './word-sets.page.html',
  styleUrls: ['./word-sets.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordSetsPage {}
