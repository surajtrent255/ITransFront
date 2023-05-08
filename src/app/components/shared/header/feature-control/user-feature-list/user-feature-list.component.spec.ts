import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeatureListComponent } from './user-feature-list.component';

describe('UserFeatureListComponent', () => {
  let component: UserFeatureListComponent;
  let fixture: ComponentFixture<UserFeatureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFeatureListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFeatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
