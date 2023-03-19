import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingTypesAndSequenceComponent } from './pricing-types-and-sequence.component';

describe('PricingTypesAndSequenceComponent', () => {
  let component: PricingTypesAndSequenceComponent;
  let fixture: ComponentFixture<PricingTypesAndSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingTypesAndSequenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingTypesAndSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
