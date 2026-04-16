import { LoggerService } from '@shared/lib/logger/logger.service';
import { WordSetEditorComponent } from '@widgets/word-sets';

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-edit-word-set',
  standalone: true,
  imports: [WordSetEditorComponent],
  templateUrl: './edit-word-set.component.html',
  styleUrl: './edit-word-set.component.scss',
})
export class EditWordSetComponent implements OnInit {
  private readonly loggerService = inject(LoggerService).createLogger('EditWordSetComponent');

  public id?: string;

  private route = inject(ActivatedRoute);

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        /* get id from url ang pass it to child component */
        map((params) => params.get('id')),
        filter((id): id is string => !!id),
        tap((id) => {
          this.id = id;
          this.loggerService.log(this.id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
