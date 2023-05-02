import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  Renderer2,
} from '@angular/core';
import { Product } from 'src/app/models/Product';
import { CategoryProduct } from 'src/app/models/CategoryProduct';

import { RJResponse } from 'src/app/models/rjresponse';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';
import { CreateSalesComponent } from '../sales/create-sales/create-sales.component';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-search-create-products',
  templateUrl: './search-create-products.component.html',
  styleUrls: ['./search-create-products.component.css'],
})
export class SearchCreateProductsComponent {
  @ViewChild('prodSelectBtnRef', { static: false })
  prodSelectBtnRef!: ElementRef;
  @ViewChild('createSalesComponent', { static: false })
  createSalesComponent!: CreateSalesComponent;

  product: Product = new Product();
  productAddShowable = false;
  categorySelectShowable = true;
  isFormSubmitable: boolean = false;
  availableCategories: CategoryProduct[] = [];
  categoriesData: CategoryProduct[] = [];
  categoriesLoaded: boolean = false;
  availableProducts: Product[] = [];

  salesBillDetailsForCart: SalesBillDetail[] = [];

  constructor(
    private productService: ProductService,
    private categoryProductService: CategoryProductService,
    private salesCartService: SalesCartService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private loginService: LoginService
  ) { }

  companyId!: number;
  branchId !: number;
  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.productService.getAllProducts(this.companyId, this.branchId).subscribe((data) => {
      this.availableProducts = data.data;
    });
    this.categoryProductService
      .getAllCategories(this.companyId, this.branchId)
      .subscribe((data) => {
        this.availableCategories = data.data;
        this.categoriesData = data.data;
        // this.letsCreateCategoryList(this.categoriesData);
        this.categoriesLoaded = true;
      });
  }

  ngAfterViewInit() {
    this.salesBillDetailsForCart.forEach((item) => {
      const button = this.prodSelectBtnRef.nativeElement;
      button.disabled = true;
    });
  }

  createProduct() {
    // this.product.categoryId = 1;
    this.product.companyId = 1;
    this.product.userId = 1;
    this.product.sellerId = 1;

    this.productService.addNewProduct(this.product,0).subscribe((data) => {
      Swal.fire(
        'Product Created ! ',
        'A new product has been created with id ' + data.data,
        'success'
      ).then((d) => {
        this.product = new Product();
      });
    });
  }

  @ViewChild('container', { static: true }) container!: ElementRef;
  letsAdd(catId: number, parentId: number, catName: string) { }

  selCategoryName!: string;
  selectCategory(categoryId: number, catName: string) {
    this.product.categoryId = categoryId;
    this.selCategoryName = catName;
  }
  addToList() {
    console.log('%%%%%%%%%%%%%%%%%%%%');
  }

  letsCreateCategoryList(categoriesData: CategoryProduct[]): string {
    let categoryHiearchyDom = '';
    function createCategoryHiearchy(categories: CategoryProduct[]) {
      categories.forEach(function (category) {
        categoryHiearchyDom += `<li><button class="fa fa-plus-square"  (click)="addToList()"  aria-hidden="true"  data-target="${category.id}" data-parent="${category.parentId}"></button>&nbsp <span class="m-r-3"> ${category.name} </span> <i class = "fa fa-caret-down" data-toggle="collapse" data-target="#data${category.id}" aria-hidden="true"></i> `;
        if (category.childCategories && category.childCategories.length > 0) {
          categoryHiearchyDom +=
            "<ul id='data" + category.id + "' class='pl-3 collapse'>";

          createCategoryHiearchy(category.childCategories);
          categoryHiearchyDom += '</li></ul>';
        }
        categoryHiearchyDom += '</li>';
      });
    }
    createCategoryHiearchy(categoriesData);
    const catHierEl = document.getElementById(
      'categoryHierarchy'
    ) as HTMLElement;
    catHierEl.innerHTML = categoryHiearchyDom;
    // catHierEl.replaceWith(new DOMParser().parseFromString(categoryHiearchyDom, "text/html").body);
    return categoryHiearchyDom;
  }

  showAddProductSec() {
    this.categorySelectShowable = false;
    this.productAddShowable = true;
  }
}
