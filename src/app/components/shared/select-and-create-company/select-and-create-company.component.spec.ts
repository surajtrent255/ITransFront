import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAndCreateCompanyComponent } from './select-and-create-company.component';

describe('SelectAndCreateCompanyComponent', () => {
  let component: SelectAndCreateCompanyComponent;
  let fixture: ComponentFixture<SelectAndCreateCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAndCreateCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAndCreateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
