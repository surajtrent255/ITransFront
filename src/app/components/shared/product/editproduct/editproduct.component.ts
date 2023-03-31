import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent {

  product: Product = new Product();
  availableCategories: CategoryProduct[] = [];
  constructor(private productService: ProductService,
    private categoryProductService: CategoryProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllCategories();

    this.getProduct(this.activatedRoute.snapshot.params['prodId']);
  }

  getAllCategories() {
    this.categoryProductService.getAllCategories().subscribe({
      next: data => {
        this.availableCategories = data.data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data.data;
        console.log(this.product)
        console.log("init");
      }
    })
  }

  createProduct(form: any) {
    console.log(this.product)
    this.productService.editProduct(this.product).subscribe({
      next: (data) => {
        alert("product successfully updated")
        this.getProduct(this.product.id)
        this.router.navigateByUrl("/dashboard/products")
      },
      complete: () => {
        console.log("completed")
      }
    })

    //   this.newProduct = $event;
    //   this.newProduct.companyId = 1;
    //   this.newProduct.userId = this.loginService.currentUser.user.id;
    //   this.newProduct.sellerId = 1;
    //   this.productService.addNewProduct(this.newProduct).subscribe({
    //     next: (data) => {
    //       console.log(data.data);
    //     },
    //     error: (error) => {
    //       console.log("Error occured ");
    //     },
    //     complete: () => {
    //       this.fetchAllProducts();
    //     }
    //   })
    //   console.log("product.component.ts")
  }

}
