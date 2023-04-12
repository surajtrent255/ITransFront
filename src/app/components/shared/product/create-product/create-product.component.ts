import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  @Output() productInfoEvent = new EventEmitter<boolean>();
  product: Product = new Product();
  availableCategories: CategoryProduct[] = [];
  constructor(
    private productService: ProductService,
    private categoryProductService: CategoryProductService,
    private loginService: LoginService
  ) { }

  compId!: number;
  branchId !: number;
  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.categoryProductService.getAllCategories(this.compId, this.branchId).subscribe({
      next: (data) => {
        this.availableCategories = data.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  createProduct(form: any) {
    this.product.companyId = this.compId;
    this.product.branchId = this.branchId;
    this.product.userId = this.loginService.currentUser.user.id;
    this.product.sellerId;
    this.productService.addNewProduct(this.product).subscribe({
      next: (data) => {
        console.log(data.data);
      },
      error: (error) => {
        console.log('Error occured ');
      },
      complete: () => {
        this.productInfoEvent.emit(true);
      },
    });
    console.log('product.component.ts');
    form.reset({ tax: 13 });
  }
}
