import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAsstetsComponent } from './fixed-asstets.component';

describe('FixedAsstetsComponent', () => {
  let component: FixedAsstetsComponent;
  let fixture: ComponentFixture<FixedAsstetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedAsstetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAsstetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
