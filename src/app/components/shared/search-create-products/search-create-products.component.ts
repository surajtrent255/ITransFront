import { Component, ElementRef, ViewChild, ViewContainerRef, Renderer2 } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { CategoryProduct } from 'src/app/models/CategoryProduct';

import { RJResponse } from 'src/app/models/rjresponse';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';
import { CreateSalesComponent } from '../sales/create-sales/create-sales.component';

@Component({
  selector: 'app-search-create-products',
  templateUrl: './search-create-products.component.html',
  styleUrls: ['./search-create-products.component.css']
})
export class SearchCreateProductsComponent {

  @ViewChild('prodSelectBtnRef', { static: false }) prodSelectBtnRef !: ElementRef;
  @ViewChild('createSalesComponent', { static: false }) createSalesComponent !: CreateSalesComponent;
  product: Product = new Product();
  productAddShowable = false;
  categorySelectShowable = true;
  isFormSubmitable: boolean = false;
  availableCategories: CategoryProduct[] = [];
  categoriesData: CategoryProduct[] = [];
  categoriesLoaded: boolean = false;
  availableProducts: Product[] = []

  // dynamicCat !: string;
  salesBillDetailsForCart: SalesBillDetail[] = [];

  constructor(private productService: ProductService, private categoryProductService: CategoryProductService, private salesCartService: SalesCartService,
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
    if (localStorage.getItem("SalesCart") !== null) {
      this.salesBillDetailsForCart = JSON.parse(localStorage.getItem("SalesCart")!)
    }
    // this.salesCartService.currentProdsInSalesCart.subscribe(data => this.salesBillDetailsForCart = data);
  }

  ngAfterViewInit() {
    this.salesBillDetailsForCart.forEach(item => {
      const button = this.prodSelectBtnRef.nativeElement;
      button.disabled = true;

    })
  }

  createProduct() {
    this.product.categoryId = 1;
    this.product.companyId = 1;
    this.product.userId = 1;
    this.product.sellerId = 1;

    this.productService.addNewProduct(this.product).subscribe(data => {
      Swal.fire("Product Created ! ", "A new product has been created with id " + data.data, "success").then((d) => {
        this.product = new Product;
      })
    });
  }

  @ViewChild('container', { static: true }) container!: ElementRef;

  letsAdd(catId: number, parentId: number, catName: string) {
  }
  // for catagories
  // ngAfterViewChecked() {
  //   // alert(this.categoriesData.length)
  //   // for (let i = 0; i < this.categoriesData.length; i++) {
  //   //   document.getElementById(`cataddplus${this.categoriesData[i].id}`)?.addEventListener('click', () => {
  //   //     this.letsAdd(this.categoriesData[i].id, this.categoriesData[i].parentId, this.categoriesData[i].name);
  //   //   })
  //   // }
  //   document.getElementById(`cataddplus1`)?.addEventListener('click', ($event: any) => {
  //     // this.letsAdd(this.categoriesData[1].id, this.categoriesData[1].parentId, this.categoriesData[1].name);
  //     // this.categoriesData.forEach(cat => {
  //     //   if (cat.id == 1) {
  //     //   }
  //     // })
  //   })
  // }

  addToList() {
    console.log("%%%%%%%%%%%%%%%%%%%%")
  }


  letsCreateCategoryList(categoriesData: CategoryProduct[]): string {
    let categoryHiearchyDom = "";
    function createCategoryHiearchy(categories: CategoryProduct[]) {
      categories.forEach(function (category) {
        categoryHiearchyDom += `<li><i class="fa fa-plus-square"  (click)="addToList()"  aria-hidden="true"  data-target="${category.id}" data-parent="${category.parentId}"></i>&nbsp <span class="m-r-3"> ${category.name} </span> <i class = "fa fa-caret-down" data-toggle="collapse" data-target="#data${category.id}" aria-hidden="true"></i> `;
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
    catHierEl.innerHTML = categoryHiearchyDom;
    return categoryHiearchyDom;
    // return "";
  }

  showAddProductSec() {
    this.categorySelectShowable = false;
    this.productAddShowable = true;
  }

  addTosalesCart($event: MouseEvent, product: Product) {
    let allowable: boolean = true;
    this.salesBillDetailsForCart.forEach(item => {
      if (item.productId === product.id) {
        allowable = false;
        disbaleSelectProdBtn($event);
        return;
      }
    })
    if (!allowable) return;


    let salesBillDetail: SalesBillDetail = new SalesBillDetail;
    salesBillDetail.productId = product.id;
    salesBillDetail.qty = 1;
    salesBillDetail.discountPerUnit = product.discount;
    salesBillDetail.rate = product.sellingPrice;
    if (allowable) this.salesBillDetailsForCart.push(salesBillDetail);
    localStorage.setItem("SalesCart", JSON.stringify(this.salesBillDetailsForCart))
    //
    console.log(this.createSalesComponent);
    this.createSalesComponent.salesBillDetailInfos = this.salesBillDetailsForCart;
    this.salesCartService.updateSalesCartInfo(this.salesBillDetailsForCart)
    disbaleSelectProdBtn($event);
  }
}

function disbaleSelectProdBtn($event: any) {
  const target = $event.target as HTMLButtonElement;
  target.setAttribute("disabled", "true");
  target.innerText = "Selected";
}
