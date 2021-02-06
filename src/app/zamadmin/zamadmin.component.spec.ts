import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZamadminComponent } from './zamadmin.component';

describe('ZamadminComponent', () => {
  let component: ZamadminComponent;
  let fixture: ComponentFixture<ZamadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZamadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZamadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
