import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModelAddComponent } from './user-model-add.component';

describe('UserModelAddComponent', () => {
  let component: UserModelAddComponent;
  let fixture: ComponentFixture<UserModelAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserModelAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
