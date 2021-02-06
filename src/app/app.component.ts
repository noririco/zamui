import { untilDestroyed } from './utils/untilDestroyed.util';
import { tap } from 'rxjs/operators';
import { timer, interval } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {}

  ngOnInit() {
    // this.colorFeature();
  }

  ngOnDestroy() {}

  colorFeature() {
    interval(5000)
      .pipe(
        tap(() => {
          const body = document.getElementsByTagName('body')[0];
          if (body.classList.contains('nighty')) {
            body.classList.remove('nighty');
            body.classList.add('daily');
          } else {
            body.classList.remove('daily');
            body.classList.add('nighty');
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
