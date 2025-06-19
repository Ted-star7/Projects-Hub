import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBidComponent } from './request-bid.component';

describe('RequestBidComponent', () => {
  let component: RequestBidComponent;
  let fixture: ComponentFixture<RequestBidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestBidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
