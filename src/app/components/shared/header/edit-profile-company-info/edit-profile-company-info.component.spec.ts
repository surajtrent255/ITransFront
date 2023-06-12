import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileCompanyInfoComponent } from './edit-profile-company-info.component';

describe('EditProfileCompanyInfoComponent', () => {
  let component: EditProfileCompanyInfoComponent;
  let fixture: ComponentFixture<EditProfileCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileCompanyInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfileCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
