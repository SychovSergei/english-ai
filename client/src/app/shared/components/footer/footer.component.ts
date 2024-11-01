import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  dateNow = signal<string>( "");

  ngOnInit() {
    this.dateNow.set(new Date().getFullYear().toString());
  }

}
