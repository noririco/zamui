import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { polling } from './utils/rxjs-operators.util';
import * as xml2js from 'xml2js';
@Injectable({
  providedIn: 'root',
})
export class RSSFeedService {
  private YNURL = environment.ynapi;
  private POURL = environment.poapi;
  public ynetFeed$ = new BehaviorSubject<any[]>([]);
  public polisaFeed$ = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {
    polling<any>(
      this.ynetRSSFeed()
        .pipe
        // tap((feed) => {
        //   console.log(feed);
        //   const items = feed.message;
        //   this.ynetFeed$.next(items);
        // })
        (),
      11000
    ).subscribe();

    polling<any>(
      this.polisaRSSFeed()
        .pipe
        // tap((feed) => {
        //   console.log(feed);
        //   const items = feed.message;
        //   this.polisaFeed$.next(items);
        // })
        (),
      11000
    ).subscribe();
  }

  public ynetRSSFeed() {
    const requestOptions: Object = {
      observe: 'body',
      responseType: 'json',
    };
    return this.http.get<any>(this.YNURL, requestOptions).pipe(
      // map((feed) => {
      //   // console.log(feed);
      //   const items = feed.message;
      //   return items;
      // }),
      tap((feed) => {
        console.log(feed);
        const items = feed.message;
        this.ynetFeed$.next(items);
      })
    );
  }
  public polisaRSSFeed() {
    const requestOptions: Object = {
      observe: 'body',
      responseType: 'json',
    };
    return this.http.get<any>(this.POURL, requestOptions).pipe(
      // map((feed) => {
      //   // console.log(feed);
      //   const items = feed.message;
      //   return items;
      // }),
      tap((feed) => {
        console.log(feed);
        const items = feed.message;
        this.polisaFeed$.next(items);
      })
    );
  }
}
