import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryProduct } from 'src/app/models/CategoryProduct';

@Injectable({
  providedIn: 'root'
})
export class SelectCategoryServiceService {

  selectedCategoryForCatCreationSubject = new BehaviorSubject<CategoryProduct>(new CategoryProduct);
  private selectedCategoryForCatCreation = this.selectedCategoryForCatCreationSubject.asObservable();

  constructor() { }

  changeSelectedCategoryForCatCreation(cat: CategoryProduct) {
    this.selectedCategoryForCatCreationSubject.next(cat);
  }
}
