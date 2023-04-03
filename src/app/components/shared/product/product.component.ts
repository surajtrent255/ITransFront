import { Component, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  availableProducts: Product[] = [];
  availableCategories: CategoryProduct[] = [];

  showableCreateProdDiv: boolean = false;
  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private router: Router
  ) { }

  newProduct!: Product;

  productInfoForUpdate!: Product

  ngOnInit() {
    this.fetchAllProducts();
  }

  fetchAllProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      this.availableProducts = data.data;
    });
  }

  showAddProductComp() {
    this.showableCreateProdDiv = true;
  }

  getProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.productInfoForUpdate = data.data;
      }
    })
  }

  editProduct(product: Product) {
    this.productInfoForUpdate = product;
    // this.getProduct(id);
    // this.router.navigateByUrl('dashboard/products/edit/' + id);
  }

  createNewProduct($event: boolean) {
    if ($event == true) {
      this.fetchAllProducts();
    }
  }
  deleteProduct(id: number) {
    this.productService.deleteProductById(id).subscribe({
      next: (res) => { console.log(res) },
      error: (error) => { console.log(error) },
      complete: () => { this.fetchAllProducts() }
    })
  }
}
