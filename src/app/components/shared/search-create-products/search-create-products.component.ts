import { Component } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { RJResponse } from 'src/app/models/rjresponse';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-create-products',
  templateUrl: './search-create-products.component.html',
  styleUrls: ['./search-create-products.component.css']
})
export class SearchCreateProductsComponent {

  product: Product = new Product();
  isFormSubmitable: boolean = false;

  availableProducts: Product[] = []
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getAllProducts().subscribe(data => {
      console.log("data== ");
      console.log(data);
      this.availableProducts = data.data
    })
  }

  createProduct() {
    this.product.categoryId = 1;
    this.product.companyId = 1;
    this.product.userId = 1;
    this.product.sellerId = 1;

    this.productService.addNewProduct(this.product).subscribe(data => {
      console.log(data.data);
      Swal.fire("Product Created ! ", "A new product has been created with id " + data.data, "success").then((d) => {
        console.log(d);
        this.product = new Product;
      })
    });
  }

}
