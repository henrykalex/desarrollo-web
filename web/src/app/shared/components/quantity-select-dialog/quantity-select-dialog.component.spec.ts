import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitySelectDialogComponent } from './quantity-select-dialog.component';

describe('QuantitySelectDialogComponent', () => {
  let component: QuantitySelectDialogComponent;
  let fixture: ComponentFixture<QuantitySelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantitySelectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitySelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
