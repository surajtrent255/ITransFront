import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillMaster } from 'src/app/models/PurchaseBillMaster';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent {
  purchaseBills: PurchaseBill[] = [];
  IsAuditor!: boolean;
  compId!: number;
  branchId!: number;
  purchaseBillMaster!: PurchaseBillMaster;

  currentPageNumber: number = 1;
  pageTotalItems: number = 3;

  constructor(
    private purchaseBillService: PurchaseBillService,
    private router: Router,
    private loginService: LoginService,
    private toastrService: ToastrService
  ) { }

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

  changePage(type: string) {
    if (type === "prev") {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedPurchaseBill();
    } else if (type === "next") {
      this.currentPageNumber += 1;
      this.fetchLimitedPurchaseBill();
    }
  }

  fetchLimitedPurchaseBill() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.purchaseBillService.getLimitedPurchaseBill(offset, this.pageTotalItems, this.compId, this.branchId).subscribe((res) => {
      if (res.data.length === 0) {
        this.toastrService.error("bills not found ")
        this.currentPageNumber -= 1;
      } else {
        this.purchaseBills = res.data;

      }
    })
  }



  goToPurchBillDetail(billNo: number) {
    this.router.navigateByUrl(`dashboard/purchasebills/${billNo}`);
  }
}
