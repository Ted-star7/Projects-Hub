import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputedOrdersComponent } from './disputed-orders.component';

describe('DisputedOrdersComponent', () => {
  let component: DisputedOrdersComponent;
  let fixture: ComponentFixture<DisputedOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputedOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
