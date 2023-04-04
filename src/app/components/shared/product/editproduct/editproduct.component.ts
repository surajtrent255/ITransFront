import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css'],
})
export class EditproductComponent {
  @Input() product: Product = new Product();
  @Output() updatedSuccessful = new EventEmitter<boolean>(false);

  compId!: number;
  availableCategories: CategoryProduct[] = [];
  constructor(
    private productService: ProductService,
    private categoryProductService: CategoryProductService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.product = new Product();
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryProductService.getAllCategories(this.compId).subscribe({
      next: (data) => {
        this.availableCategories = data.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getProduct(id: number) {
    this.productService.getProductByIdAndCompanyId(id, this.compId).subscribe({
      next: (data) => {
        this.product = data.data;
        console.log(this.product);
        console.log('init');
      },
    });
  }

  editProduct(form: any) {
    console.log(this.product);
    this.productService.editProduct(this.product).subscribe({
      next: (data) => {
        // alert("product successfully updated")
        this.getProduct(this.product.id);
        this.updatedSuccessful.emit(true);
      },
      complete: () => {
        console.log('completed');
        const closeBtn = document.getElementById(
          'closeEditButton'
        ) as HTMLButtonElement;
        closeBtn.click();
      },
    });

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
