import { Component } from '@angular/core';
import { InventoryProducts } from 'src/app/models/InventoryProducts';
import { RJResponse } from 'src/app/models/rjresponse';
import { Stock } from 'src/app/models/Stock';
import { User } from 'src/app/models/user';
import { ProductService } from 'src/app/service/product.service';
import { StockService } from 'src/app/service/stock/stock.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillMaster } from 'src/app/models/PurchaseBillMaster';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
})
export class PurchaseComponent {
  purchaseBills: PurchaseBill[] = [];
  IsAuditor!: boolean;
  compId!: number;
  branchId!: number;
  purchaseBillMaster!: PurchaseBillMaster;
  constructor(
    private purchaseBillService: PurchaseBillService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getAllPurchaseBills(this.compId);
    let roles = localStorage.getItem('CompanyRoles');
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }
  }

  getAllPurchaseBills(compId: number) {
    this.purchaseBillService
      .getAllPurchaseBillByCompId(this.compId, this.branchId)
      .subscribe({
        next: (data) => {
          console.log(data.data);
          this.purchaseBills = data.data;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  createNewPurchaseBill() {
    this.router.navigateByUrl('dashboard/purchase/create');
  }

  goToPurchBillDetail(billNo: number) {
    this.router.navigateByUrl(`dashboard/purchasebills/${billNo}`);
  }
}
