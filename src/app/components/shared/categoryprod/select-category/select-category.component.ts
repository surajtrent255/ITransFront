import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { SelectCategoryServiceService } from '../select-category-service.service';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.css']
})
export class SelectCategoryComponent {

  @Input() nodes: CategoryProduct[] = [];

  constructor(private selectCategoryService: SelectCategoryServiceService) {
  }



  toggleNode(node: CategoryProduct) {
    console.log(node);
    console.log(node.showChildren)

    node.showChildren = !node.showChildren;
  }

  selectCategory(node: CategoryProduct) {
    this.selectCategoryService.changeSelectedCategoryForCatCreation(node);
    // this.selectedCategory.emit(node.id);
  }


}
