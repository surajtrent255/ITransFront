import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentDetailsComponent } from './edit-payment-details.component';

describe('EditPaymentDetailsComponent', () => {
  let component: EditPaymentDetailsComponent;
  let fixture: ComponentFixture<EditPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
