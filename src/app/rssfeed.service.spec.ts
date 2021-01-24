import { TestBed } from '@angular/core/testing';

import { RSSFeedService } from './rssfeed.service';

describe('RSSFeedService', () => {
  let service: RSSFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RSSFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
