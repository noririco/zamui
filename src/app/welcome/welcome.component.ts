import { untilDestroyed } from './../utils/untilDestroyed.util';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { interval, timer } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { PostService } from './../post.service';
import { RSSFeedService } from './../rssfeed.service';
import { staggerList } from './../shared/animations/staggerList.animation';
import { Store } from './../storez';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [staggerList],
})
export class WelcomeComponent implements OnInit {
  myText = 'צמרות סוכנות לביטוח';
  staty = new Store({
    initialState: {
      //We add an offset so item1 is visible more time
      lefty: -1920,
      maxWidth: 7000,
    },
  });
  lefty$$ = this.staty.selectShared('lefty');
  maxWidth$$ = this.staty.selectShared('maxWidth');

  @ViewChildren('kot') kotarot: QueryList<any>;

  constructor(
    public rssFeed: RSSFeedService,
    public postService: PostService,
    public router: Router
  ) {}

  ngOnInit() {
    interval(20)
      .pipe(
        // tap(console.log),
        tap(() => {
          if (this.staty.state.lefty > this.staty.state.maxWidth) {
            this.staty.reset();
          }
          this.staty.updateState({ lefty: this.staty.state.lefty + 1 });
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }
  ngOnDestroy() {}

  ngAfterViewInit() {
    timer(200)
      .pipe(
        tap(() => {
          let sum = 0;
          this.kotarot.forEach((koteret) => {
            sum += koteret.nativeElement.clientWidth;
          });
          this.staty.updateState({
            maxWidth: sum,
          });
          console.log(JSON.stringify(this.staty.state, null, 4));
        }),
        switchMap(() =>
          this.kotarot.changes.pipe(
            tap((changes) => {
              console.log(changes);
              this.staty.reset();

              let sum = 0;
              changes.forEach((koteret) => {
                sum += koteret.nativeElement.clientWidth;
              });
              this.staty.updateState({
                maxWidth: sum,
              });

              console.log(JSON.stringify(this.staty.state, null, 4));
            }),
            untilDestroyed(this)
          )
        )
      )
      .subscribe();
  }
}
