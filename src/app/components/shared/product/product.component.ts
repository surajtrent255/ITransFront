import { Component, Output, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginationCustom, PaginationType } from 'src/app/interfaces/PaginatinCustom';
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

  searchProductName: string = ''

  availableProducts: Product[] = [];
  availableCategories: CategoryProduct[] = [];
  typerate: VatRateTypes[] = [];
  pagination: PaginationCustom = new PaginationCustom;

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


  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    // this.fetchAllProducts(this.compId, this.branchId);
    this.fetchLimitedProducts(PaginationType.START);
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

  fetchLimitedProducts(paginationType: PaginationType) {
    let prodId = this.pagination.currentLastObjectId;
    let prodLimit = this.pagination.productsLimit;
    let compId = this.compId;
    let branchId = this.branchId;
    this.pagination.type = paginationType;
    this.productService.getLimitedProducts(this.pagination, compId, branchId).subscribe((data) => {
      if (data.data.length < 1) {
        const nextPageEl = document.getElementById("nextPage") as HTMLElement;
        this.renderer.setStyle(nextPageEl, "display", "none")
        if (this.pagination.type === PaginationType.NEXT) {
          this.pagination.current = this.pagination.current - 1;
        }
      } else {
        this.availableProducts = data.data
        const nextPageEl = document.getElementById("nextPage") as HTMLElement;
        this.renderer.removeStyle(nextPageEl, "display")
        this.pagination.currentFirstObjectId = this.availableProducts[0].id;
        this.pagination.currentLastObjectId = this.availableProducts[this.availableProducts.length - 1].id;
      }


    });
  }

  changePage(pageType: string) {
    switch (pageType) {
      case "start":
        this.pagination.current = 1;
        this.fetchLimitedProducts(PaginationType.START)
        break;
      case "prev":
        this.pagination.current = this.pagination.current - 1;
        this.fetchLimitedProducts(PaginationType.PREVIOUS)
        break;
      case "next":
        this.pagination.current = this.pagination.current + 1;
        this.fetchLimitedProducts(PaginationType.NEXT)
        break;
      case "end":
        this.pagination.current = 1000;
        this.fetchLimitedProducts(PaginationType.END)
        break;
    }
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

  createNewProduct($event: number) {
    if ($event > 0) {
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
}
