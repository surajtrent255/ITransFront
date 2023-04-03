import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { RJResponse } from 'src/app/models/rjresponse';
import { CategoryProductService } from 'src/app/service/category-product.service';

@Component({
  selector: 'app-createcategory',
  templateUrl: './createcategory.component.html',
  styleUrls: ['./createcategory.component.css']
})
export class CreatecategoryComponent {

  @Output() categorySuccessInfoEvent = new EventEmitter<boolean>();
  categoryProd: CategoryProduct = new CategoryProduct
  categoriesData: CategoryProduct[] = []

  constructor(private categoryProductService: CategoryProductService) {

  }

  ngOnInit() {
    this.fetchAllCategories();
  }

  fetchAllCategories() {
    this.categoryProductService.getAllCategories().subscribe(data => {
      this.categoriesData = data.data;
    })
  }

  addNewCategory() {
    const catCreateDiv = document.getElementById("createCatDiv") as HTMLDivElement;
    catCreateDiv.removeAttribute("hidden");
  }

  createCategoryProd(createCategoryProdForm: any) {
    this.categoryProductService.addNewCategory(this.categoryProd).subscribe({
      next: (data: RJResponse<number>) => {
        createCategoryProdForm.reset();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        createCategoryProdForm.reset();
        this.fetchAllCategories();
        this.categorySuccessInfoEvent.emit(true);
      }
    })
  }

}
