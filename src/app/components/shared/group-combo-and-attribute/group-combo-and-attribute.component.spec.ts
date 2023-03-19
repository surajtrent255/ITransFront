import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupComboAndAttributeComponent } from './group-combo-and-attribute.component';

describe('GroupComboAndAttributeComponent', () => {
  let component: GroupComboAndAttributeComponent;
  let fixture: ComponentFixture<GroupComboAndAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupComboAndAttributeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupComboAndAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
