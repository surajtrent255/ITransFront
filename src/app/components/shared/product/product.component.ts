import { Component, Output, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginationCustom } from 'src/app/interfaces/PaginatinCustom';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { LoginService } from 'src/app/service/shared/login.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})

export class ProductComponent {

  // title = "pagination";
  // POSTS: any;
  // page: number = 1;
  // count: number = 0;
  // tableSize: number = 10;
  // tableSizes: any = [1, 10, 15, 20];

  availableProducts: Product[] = [];
  availableCategories: CategoryProduct[] = [];
  typerate: VatRateTypes[] = [];
  enableCreateProduct: boolean = false;

  // pagination: PaginationCustom = new PaginationCustom;

  showableCreateProdDiv: boolean = false;
  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService,
    private renderer: Renderer2
  ) { }

  newProduct!: Product;
  IsAuditor!: boolean;

  productInfoForUpdateId!: number;
  compId!: number;
  branchId!: number;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  searchBy: string = "name";
  searchWildCard: string = '';

  sortBy: string = "id"

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    // this.fetchAllProducts(this.compId, this.branchId);
    this.fetchLimitedProducts();
    let roles = localStorage.getItem('CompanyRoles');
    this.getAllVatRateTypes();

    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }

    // angular pagination
    // this.tableSize = 1;
    // this.page = 1;
    // this.postList();

  }

  // postList(): void {
  //   this.productService.getAllPosts().subscribe((response) => {
  //     this.POSTS = response;
  //   })
  // }

  // onTableDataChanges(event: any) {
  //   this.page = event;
  //   this.postList();
  // }

  // onTableSizeChange(event: any): void {
  //   this.tableSize = event.target.value;
  //   this.page = 1;
  //   this.postList();
  // }
  // angular pagination finish



  changePage(type: string) {
    if (type === "prev") {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedProducts();
    } else if (type === "next") {
      this.currentPageNumber += 1;
      this.fetchLimitedProducts();
    }
  }

  fetchLimitedProducts() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.productService.getLimitedProducts(offset, this.pageTotalItems, this.searchBy, this.searchWildCard, this.sortBy, this.compId, this.branchId).subscribe((res) => {
      if (res.data.length === 0 || res.data === undefined) {
        this.toastrService.error("products not found ")
        this.currentPageNumber -= 1;
      } else {
        this.availableProducts = res.data;

      }
    })
  }

  fetchAllProducts(compId: number, branchId: number) {
    this.productService.getAllProducts(compId, branchId).subscribe((data) => {
      this.availableProducts = data.data;
    });
  }

  showAddProductComp() {
    this.showableCreateProdDiv = true;
  }

  getProduct(id: number) {
    this.productInfoForUpdateId = id;
  }

  editProduct(id: number) {
    this.productInfoForUpdateId = id;
    // this.getProduct(id);
    // this.router.navigateByUrl('dashboard/products/edit/' + id);
  }

  fetchAllProductsAfterEdit() {
    this.fetchAllProducts(this.compId, this.branchId);
  }
  getAllVatRateTypes() {
    this.productService.getAllVatRateTypes().subscribe((res) => {
      console.log(res.data);
      this.typerate = res.data;
    });
  }

  createNewProduct($event: Product) {
    if ($event.id > 0) {
      this.fetchAllProducts(this.compId, this.branchId);
    }
  }
  deleteProduct(id: number) {
    this.productService.deleteProductById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success('product has been deleted');
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.fetchAllProducts(this.compId, this.branchId);
      },
    });
  }


  displayCreateProductComp() {
    this.enableCreateProduct = true;
    const createNewProductBtn = document.getElementById("createNewProduct") as HTMLButtonElement;
    createNewProductBtn.click();
  }
}
