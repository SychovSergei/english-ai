import { ConnectivityService } from '@shared/api/connectivity.service';

import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private connectivity = inject(ConnectivityService);

  readonly dateNow = signal<string>(new Date().getFullYear().toString());
  readonly isOnline = this.connectivity.isOnline;

  readonly connectionStatus = computed(() => {
    return this.connectivity.isOnline() ? 'Online' : 'Offline';
  });
}
