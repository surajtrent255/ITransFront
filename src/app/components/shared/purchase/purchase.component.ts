import { Component } from '@angular/core';
import { InventoryProducts } from 'src/app/models/InventoryProducts';
import { RJResponse } from 'src/app/models/rjresponse';
import { Stock } from 'src/app/models/Stock';
import { User } from 'src/app/models/user';
import { ProductService } from 'src/app/service/product.service';
import { StockService } from 'src/app/service/stock/stock.service';
import { LoginService } from "src/app/service/shared/login.service"
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillMaster } from 'src/app/models/PurchaseBillMaster';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent {


  purchaseBills: PurchaseBill[] = []
  compId !: number;
  purchaseBillMaster !: PurchaseBillMaster;
  constructor(private purchaseBillService: PurchaseBillService,
    private router: Router,
    private loginService: LoginService) {

  }

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.getAllPurchaseBills(this.compId);
  }

  getAllPurchaseBills(compId: number) {
    this.purchaseBillService.getAllPurchaseBillByCompId(this.compId).subscribe({
      next: (data) => {
        console.log(data.data);
        this.purchaseBills = data.data
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  createNewPurchaseBill() {
    this.router.navigateByUrl("dashboard/purchase/create")
  }


}
