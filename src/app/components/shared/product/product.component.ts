import { Component, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { LoginService } from 'src/app/service/shared/login.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})

export class ProductComponent {

  title = "pagination";
  POSTS: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [5, 10, 15, 20];



  availableProducts: Product[] = [];
  availableCategories: CategoryProduct[] = [];

  showableCreateProdDiv: boolean = false;
  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  newProduct!: Product;
  IsAuditor!: boolean;

  productInfoForUpdateId!: number;
  compId!: number;
  branchId!: number;
  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchAllProducts(this.compId, this.branchId);
    let roles = localStorage.getItem('CompanyRoles');

    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }

    // pagination
    this.postList();
  }

  postList(): void {
    this.productService.getAllPosts().subscribe((response) => {
      this.POSTS = response;
    })
  }

  onTableDataChanges(event: any) {
    this.page = event;
    this.postList();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.postList();
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
