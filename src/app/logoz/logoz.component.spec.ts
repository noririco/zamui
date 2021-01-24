import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogozComponent } from './logoz.component';

describe('LogozComponent', () => {
  let component: LogozComponent;
  let fixture: ComponentFixture<LogozComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogozComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogozComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
