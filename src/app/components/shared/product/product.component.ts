import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  availableProducts !: Product[];
  availableCategories !: CategoryProduct[];

  showableCreateProdDiv: boolean = false;
  constructor(private productService: ProductService, private loginService: LoginService,
    private router: Router) { }

  newProduct !: Product;
  ngOnInit() {
    this.fetchAllProducts();
  }

  fetchAllProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.availableProducts = data.data
    })
  }
  showAddProductComp() {
    this.showableCreateProdDiv = true;
  }
  editProduct(id: number) {
    this.router.navigateByUrl("dashboard/products/edit/" + id);
  }
  createNewProduct($event: Product) {
    this.newProduct = $event;
    this.newProduct.companyId = 1;
    this.newProduct.userId = this.loginService.currentUser.user.id;
    this.newProduct.sellerId = 1;
    this.productService.addNewProduct(this.newProduct).subscribe({
      next: (data) => {
        console.log(data.data);
      },
      error: (error) => {
        console.log("Error occured ");
      },
      complete: () => {
        this.fetchAllProducts();
      }
    })
    console.log("product.component.ts")

  }
}
