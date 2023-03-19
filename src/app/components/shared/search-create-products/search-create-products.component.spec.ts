import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCreateProductsComponent } from './search-create-products.component';

describe('SearchCreateProductsComponent', () => {
  let component: SearchCreateProductsComponent;
  let fixture: ComponentFixture<SearchCreateProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCreateProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCreateProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
