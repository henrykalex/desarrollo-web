import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModelViewComponent } from './user-model-view.component';

describe('UserModelViewComponent', () => {
  let component: UserModelViewComponent;
  let fixture: ComponentFixture<UserModelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserModelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
