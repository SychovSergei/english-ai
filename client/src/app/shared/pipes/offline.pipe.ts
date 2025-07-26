import { NetworkService } from '@shared/infrastructure';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'offlineIndicatorPipe',
})
export class OfflinePipe implements PipeTransform {
  constructor(private networkService: NetworkService) {}

  transform(value: boolean): string {
    if (value) {
      return `green`;
    } else {
      return `red`;
    }
  }
}
