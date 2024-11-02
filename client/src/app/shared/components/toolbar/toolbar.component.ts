import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { IUserDto } from '../../../core/models/dtos/user.dto';
import { BreakpointService, EBreakpoints } from '../../../core/services/breakpoint.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit, OnDestroy {

  // userData$: Observable<IUserDto | null> = of(null);

  isOver600px: boolean = true;
  isOver600pxSubscription!: Subscription;

  @Output() topbarMenuClick: EventEmitter<boolean> = new EventEmitter();

  constructor(public breakpointService: BreakpointService) {
  }

  ngOnInit() {
    this.isOver600pxSubscription = this.breakpointService.getBreakpointState(EBreakpoints.Min600)?.subscribe((res) => {
      this.isOver600px = res;
    })!;
  }

  ngOnDestroy() {
    this.isOver600pxSubscription.unsubscribe();
  }

  menuClick() {
    this.topbarMenuClick.emit();
  }
}
