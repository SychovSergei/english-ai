import { NetworkService } from '@shared/infrastructure/network.service';

import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AsyncPipe],
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
