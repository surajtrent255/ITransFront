import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFeatureComponent } from './assign-feature.component';

describe('AssignFeatureComponent', () => {
  let component: AssignFeatureComponent;
  let fixture: ComponentFixture<AssignFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
