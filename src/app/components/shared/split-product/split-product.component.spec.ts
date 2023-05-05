import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitProductComponent } from './split-product.component';

describe('SplitProductComponent', () => {
  let component: SplitProductComponent;
  let fixture: ComponentFixture<SplitProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplitProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
