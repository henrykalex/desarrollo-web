import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersRequestsComponent } from './orders-requests.component';

describe('OrdersRequestsComponent', () => {
  let component: OrdersRequestsComponent;
  let fixture: ComponentFixture<OrdersRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
