import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnconfirmedOrdersComponent } from './unconfirmed-orders.component';

describe('UnconfirmedOrdersComponent', () => {
  let component: UnconfirmedOrdersComponent;
  let fixture: ComponentFixture<UnconfirmedOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnconfirmedOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnconfirmedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
