import {
  ChangeDetectionStrategy,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { interval, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RSSFeedService } from './rssfeed.service';
import { staggerList } from './shared/animations/staggerList.animation';
import { Store } from './storez';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [staggerList],
})
export class AppComponent {
  myText = 'צמרות סוכנות לביטוח';
  staty = new Store({
    initialState: {
      //We add an offset so item1 is visible more time
      lefty: -1000,
      maxWidth: 7000,
      freeText: `
      ביטוח פנסיוני
      אחד מסוגי הביטוח החשובים ביותר לכל עובד, שכיר או עצמאי בישראל, הוא הביטוח הפנסיוני. ביטוח פנסיה מספק ביטחון לכל עובד בישראל המחזיק בקופת הפנסיה.`,
    },
  });
  lefty$$ = this.staty.selectShared('lefty');
  maxWidth$$ = this.staty.selectShared('maxWidth');
  freeText$$ = this.staty.selectShared('freeText');

  @ViewChildren('kot') kotarot: QueryList<any>;

  constructor(public rssFeed: RSSFeedService) {}

  ngOnInit() {
    interval(20)
      .pipe(
        // tap(console.log),
        tap(() => {
          if (this.staty.state.lefty > this.staty.state.maxWidth) {
            this.staty.reset();
          }
          this.staty.updateState({ lefty: this.staty.state.lefty + 1 });
        })
      )
      .subscribe();
  }

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
        })
      )
      .subscribe();
  }
}
