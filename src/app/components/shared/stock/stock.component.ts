import { Component } from '@angular/core';
import { InventoryProducts } from 'src/app/models/InventoryProducts';
import { Stock } from 'src/app/models/Stock';
import { RJResponse } from 'src/app/models/rjresponse';
import { ProductService } from 'src/app/service/product.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {

  stock: Stock = new Stock;
  availableProducts !: InventoryProducts[]
  userId !: number;
  companyId !: number;
  constructor(private productService: ProductService, private stockService: StockService, private loginService: LoginService) { }

  ngOnInit() {
    this.userId = this.loginService.currentUser.user.id;
    this.companyId = this.loginService.getCompnayId();
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProductsForInventory(this.companyId).subscribe({
      next: (data: RJResponse<InventoryProducts[]>) => {
        this.availableProducts = data.data;
        console.log(this.availableProducts)
      },
      error: (error) => {
        console.log("sorry")
        console.log(error);
      }
    })
  }



  createNewProduct(event: number) {
    this.getAllProducts();
  }

}
