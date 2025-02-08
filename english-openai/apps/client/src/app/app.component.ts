import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUserInfo();
  }
}
