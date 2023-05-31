import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportDetailComponent } from './purchase-report-detail.component';

describe('PurchaseReportDetailComponent', () => {
  let component: PurchaseReportDetailComponent;
  let fixture: ComponentFixture<PurchaseReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseReportDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
