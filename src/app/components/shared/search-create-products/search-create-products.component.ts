import { Component, ElementRef, ViewChild, ViewContainerRef, Renderer2 } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { CategoryProduct } from 'src/app/models/CategoryProduct';

import { RJResponse } from 'src/app/models/rjresponse';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';
import { CategoryProductService } from 'src/app/service/category-product.service';

@Component({
  selector: 'app-search-create-products',
  templateUrl: './search-create-products.component.html',
  styleUrls: ['./search-create-products.component.css']
})
export class SearchCreateProductsComponent {

  product: Product = new Product();
  productAddShowable = false;
  categorySelectShowable = true;
  isFormSubmitable: boolean = false;
  availableCategories: CategoryProduct[] = [];
  categoriesData: CategoryProduct[] = [];
  categoriesLoaded: boolean = false;
  availableProducts: Product[] = []
  constructor(private productService: ProductService, private categoryProductService: CategoryProductService,
    private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.productService.getAllProducts().subscribe(data => {
      this.availableProducts = data.data
    })
    this.categoryProductService.getAllCategories().subscribe(data => {
      this.availableCategories = data.data;
      this.categoriesData = data.data;
      this.letsCreateCategoryList(this.categoriesData);
      this.categoriesLoaded = true;
    })

  }

  createProduct() {
    this.product.categoryId = 1;
    this.product.companyId = 1;
    this.product.userId = 1;
    this.product.sellerId = 1;

    this.productService.addNewProduct(this.product).subscribe(data => {
      console.log(data.data);
      Swal.fire("Product Created ! ", "A new product has been created with id " + data.data, "success").then((d) => {
        console.log(d);
        this.product = new Product;
      })
    });
  }

  @ViewChild('container', { static: true }) container!: ElementRef;

  letsAdd(catId: number, parentId: number, catName: string) {
    console.log(catId, parentId, catName);
  }
  // for catagories
  // ngAfterViewChecked() {
  //   // alert(this.categoriesData.length)
  //   // for (let i = 0; i < this.categoriesData.length; i++) {
  //   //   document.getElementById(`cataddplus${this.categoriesData[i].id}`)?.addEventListener('click', () => {
  //   //     this.letsAdd(this.categoriesData[i].id, this.categoriesData[i].parentId, this.categoriesData[i].name);
  //   //   })
  //   // }
  //   console.log("suraj")
  //   document.getElementById(`cataddplus1`)?.addEventListener('click', ($event: any) => {
  //     console.log($event.target.attributes['data-target'].value)
  //     // this.letsAdd(this.categoriesData[1].id, this.categoriesData[1].parentId, this.categoriesData[1].name);
  //     // this.categoriesData.forEach(cat => {
  //     //   if (cat.id == 1) {
  //     //     console.log(cat)
  //     //   }
  //     // })
  //   })
  // }

  addToList() {
    console.log("addToList has been called");
  }


  letsCreateCategoryList(categoriesData: CategoryProduct[]): string {
    let categoryHiearchyDom = "";
    function createCategoryHiearchy(categories: CategoryProduct[]) {
      categories.forEach(function (category) {
        categoryHiearchyDom += `<li><i class="fa fa-plus-square" id='cataddplus${category.id}'  aria-hidden="true"  data-target="${category.id}" data-parent="${category.parentId}"></i>&nbsp <span class="m-r-3"> ${category.name} </span> <i class = "fa fa-caret-down" data-toggle="collapse" data-target="#data${category.id}" aria-hidden="true"></i> `;
        if (category.childCategories && category.childCategories.length > 0) {
          categoryHiearchyDom += "<ul id='data" + category.id + "' class='pl-3 collapse'>";

          createCategoryHiearchy(category.childCategories)
          categoryHiearchyDom += "</li></ul>";
        }
        categoryHiearchyDom += "</li>";

      })
    }
    createCategoryHiearchy(categoriesData);
    const catHierEl = document.getElementById("categoryHierarchy") as HTMLElement
    // catHierEl.appendChild(categoryHiearchyDom);
    catHierEl.innerHTML = categoryHiearchyDom;
    return categoryHiearchyDom;
  }

  showAddProductSec() {
    console.log("dsfs")
    this.categorySelectShowable = false;
    this.productAddShowable = true;
  }

}
