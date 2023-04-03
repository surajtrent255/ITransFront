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
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.categoryProductService.getAllCategories().subscribe({
      next: (data) => {
        this.availableCategories = data.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  createProduct(form: any) {
    console.log(this.product);
    console.log('creating');
    console.log('createproduct');
    this.product.companyId = this.loginService.getCompnayId();
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
    form.reset();

  }
}
