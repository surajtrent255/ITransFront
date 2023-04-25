import { TestBed } from '@angular/core/testing';

import { SelectCategoryServiceService } from './select-category-service.service';

describe('SelectCategoryServiceService', () => {
  let service: SelectCategoryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectCategoryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
