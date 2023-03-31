import { Component } from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { RJResponse } from 'src/app/models/rjresponse';
import { CategoryProductService } from 'src/app/service/category-product.service';

@Component({
  selector: 'app-categoryprod',
  templateUrl: './categoryprod.component.html',
  styleUrls: ['./categoryprod.component.css']
})
export class CategoryprodComponent {

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
    console.log("creating category **********");
    this.categoryProductService.addNewCategory(this.categoryProd).subscribe((data: RJResponse<number>) => {
      console.log(data.data);
      console.log("hurry")
      createCategoryProdForm.reset();
      this.fetchAllCategories();
    }, (error) => {

    })

  }

}
