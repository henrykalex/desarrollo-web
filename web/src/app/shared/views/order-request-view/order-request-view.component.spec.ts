import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestViewComponent } from './order-request-view.component';

describe('OrderRequestViewComponent', () => {
  let component: OrderRequestViewComponent;
  let fixture: ComponentFixture<OrderRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
