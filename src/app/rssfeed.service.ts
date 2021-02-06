import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from './../environments/environment';
import { polling } from './utils/rxjs-operators.util';
import { untilDestroyed } from './utils/untilDestroyed.util';

@Injectable({
  providedIn: 'root',
})
export class RSSFeedService {
  private readonly YNURL = environment.ynapi;
  private readonly POURL = environment.poapi;
  private readonly ynetFeedInterval = 1000 * 60 * 15; // 15min
  private readonly polisaFeedInterval = 1000 * 60 * 60; // 1hour
  private readonly polisaInterval = 1000 * 60; // 1min
  private readonly maxRenderedPolisaItems = 5; // 5 items from 10
  private readonly requestOptions: Object = {
    observe: 'body',
    responseType: 'json',
  };

  public ynetFeed$ = new BehaviorSubject<any[]>([]);
  public polisaFeed$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    polling<any>(this.ynetRSSFeed$, this.ynetFeedInterval)
      .pipe(
        map((feed: any) => feed.message.reverse()),
        tap((items) => this.ynetFeed$.next(items)),
        untilDestroyed(this)
      )
      .subscribe();

    polling<any>(this.polisaRSSFeed$, this.polisaFeedInterval)
      .pipe(
        map((feed) => feed.message),
        switchMap((originalList) =>
          timer(0, this.polisaInterval).pipe(
            // tap((tick) => {
            //   console.log(tick);
            // }),
            map((tick) => {
              if (tick % 2 !== 0)
                return originalList.slice(
                  this.maxRenderedPolisaItems,
                  originalList.length
                );
              else return originalList.slice(0, this.maxRenderedPolisaItems);
            }),
            tap((shortList) => {
              this.polisaFeed$.next(shortList);
            })
          )
        ),
        untilDestroyed(this)
      )
      .subscribe();
  }

  ngOnDestroy() {}

  public ynetRSSFeed$ = this.http.get<any>(this.YNURL, this.requestOptions);
  public polisaRSSFeed$ = this.http.get<any>(this.POURL, this.requestOptions);
}
