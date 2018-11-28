import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSelectDialogComponent } from './location-select-dialog.component';

describe('LocationSelectDialogComponent', () => {
  let component: LocationSelectDialogComponent;
  let fixture: ComponentFixture<LocationSelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSelectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
