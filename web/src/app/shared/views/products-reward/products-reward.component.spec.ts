import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsRewardComponent } from './products-reward.component';

describe('ProductsRewardComponent', () => {
  let component: ProductsRewardComponent;
  let fixture: ComponentFixture<ProductsRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
