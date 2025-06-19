import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersInRevisionComponent } from './orders-in-revision.component';

describe('OrdersInRevisionComponent', () => {
  let component: OrdersInRevisionComponent;
  let fixture: ComponentFixture<OrdersInRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersInRevisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersInRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
