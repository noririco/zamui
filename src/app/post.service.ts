import { untilDestroyed } from './utils/untilDestroyed.util';
import { ApiService } from './api.service';
import { tap, map, filter, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { polling } from './utils/rxjs-operators.util';

@Injectable({
  providedIn: 'root',
})
export class PostService extends ApiService {
  private readonly postsInterval = 10000; // 10 sec
  constructor(protected http: HttpClient) {
    super(environment.postsapi, http);

    polling<any>(this.allPosts$$, this.postsInterval)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  ngOnDestroy() {}

  public posts$ = new BehaviorSubject<any[]>([]);

  allPosts$$ = this.getAll().pipe(
    map((feed) => {
      console.log(feed);
      const items = feed.message;
      return items;
      // this.posts$.next(items);
    })
  );
  lastPost$$ = this.allPosts$$.pipe(
    filter((items) => !!items),
    map((items) => {
      console.log(items);
      return items[items.length - 1];
      // this.posts$.next(items);
    })
  );

  public post(m) {
    // console.log(m);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'my-auth-token'
      }),
    };
    const post = {
      msg: m,
    };
    return this.http
      .post<any>(environment.postsapi, post, httpOptions)
      .pipe(take(1))
      .subscribe();
  }
}
