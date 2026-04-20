import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-word-sets-page',
  templateUrl: './word-sets.page.html',
  styleUrls: ['./word-sets.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordSetsPage {}
