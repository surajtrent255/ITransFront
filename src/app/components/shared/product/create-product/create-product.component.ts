import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {

  @Output() productInfoEvent = new EventEmitter<Product>();
  product: Product = new Product();
  availableCategories: CategoryProduct[] = [];
  constructor(private productService: ProductService, private categoryProductService: CategoryProductService,
  ) { }

  ngOnInit() {
    this.categoryProductService.getAllCategories().subscribe({
      next: data => {
        this.availableCategories = data.data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  createProduct(form: any) {
    console.log(this.product)

    this.productInfoEvent.emit(this.product);
    console.log("createproduct")
    form.reset();
  }
}
