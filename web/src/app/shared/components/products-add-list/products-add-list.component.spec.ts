import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAddListComponent } from './products-add-list.component';

describe('ProductsAddListComponent', () => {
  let component: ProductsAddListComponent;
  let fixture: ComponentFixture<ProductsAddListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsAddListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsAddListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
