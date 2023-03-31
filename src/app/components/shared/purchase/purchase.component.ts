import { Component } from '@angular/core';
import { InventoryProducts } from 'src/app/models/InventoryProducts';
import { RJResponse } from 'src/app/models/rjresponse';
import { Stock } from 'src/app/models/Stock';
import { User } from 'src/app/models/user';
import { ProductService } from 'src/app/service/product.service';
import { StockService } from 'src/app/service/stock/stock.service';
import { LoginService } from "src/app/service/shared/login.service"

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent {

  stock: Stock = new Stock;
  availableProducts !: InventoryProducts[]
  userId !: number;
  constructor(private productService: ProductService, private stockService: StockService, private loginService: LoginService) { }

  ngOnInit() {
    console.log(this.loginService.currentUser.user.id)
    this.userId = this.loginService.currentUser.user.id;
    this.getAllProducts();

  }

  getAllProducts() {
    this.productService.getAllProductsForInventory(1).subscribe({
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

  makePurchase(prodId: number) {
    const inputStockQtyElement = document.getElementById("inputQty" + prodId) as HTMLInputElement;
    let inputStockQty = (Number(inputStockQtyElement.value));
    if (inputStockQty <= 0) {
      return;
    }
    this.stock.productId = prodId;
    this.stock.companyId = 1;
    this.stock.qty = inputStockQty;
    this.stockService.updateStockWithProdIdAndCompanyId(this.stock).subscribe({
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.getAllProducts();
      }
    })
  }

}
