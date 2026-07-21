import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAvailabilityModalComponent } from './booking-availability-modal.component';

describe('BookingAvailabilityModalComponent', () => {
  let component: BookingAvailabilityModalComponent;
  let fixture: ComponentFixture<BookingAvailabilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingAvailabilityModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingAvailabilityModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
