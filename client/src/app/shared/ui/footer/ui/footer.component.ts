import { NetworkService } from '@shared/infrastructure';

import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { OfflinePipe } from '@shared/pipes/offline.pipe';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AsyncPipe, OfflinePipe, NgStyle, MatIcon],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  dateNow = signal<string>('');
  network = inject(NetworkService);

  ngOnInit(): void {
    this.dateNow.set(new Date().getFullYear().toString());
  }
}
