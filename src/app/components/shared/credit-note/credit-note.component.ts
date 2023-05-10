import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesBillDetailWithProdInfo } from 'src/app/models/SalesBillDetailWithProdInfo';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.css'],
})
export class CreditNoteComponent {
  salesBillDetails!: SalesBillInvoice;
  SelectedProductDetails: SalesBillDetailWithProdInfo[] = [];
  productDetails: SalesBillDetailWithProdInfo[] = [];
  serialNumber!: number;
  date!: string;
  billNo!: number;
  total!: number;
  selectedProductIds: number[] = [];
  selectedProductReasons: { productId: number; reason: string }[] = [];
  selectedProductQTY!: { productId: number; qty: number };
  qty!: number;
  reason!: string;

  //
  totalTaxAmount!: number;
  totalAmount!: number;

  constructor(
    private salesService: SalesBillServiceService,
    private commonService: CommonService,
    private creditNoteService: CreditNoteService,
    private toasterService: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    const length = 8;
    let serialNumber = '';
    for (let i = 0; i < length; i++) {
      serialNumber += Math.floor(Math.random() * 10);
    }
    this.serialNumber = Number(serialNumber);
    let date = new Date();
    this.date = this.commonService.formatDate(Number(date));

    // this.fetchSalesBillDetailForInvoice(1);
  }

  selectedProduct(e: any, data: SalesBillDetailWithProdInfo) {
    if (e.target.checked === true) {
      this.SelectedProductDetails.push(data);
      this.selectedProductIds.push(data.productId);
    } else {
      this.SelectedProductDetails.pop();
      this.selectedProductIds.pop();
    }
    console.log(this.SelectedProductDetails);
  }

  fetchSalesBillDetailForInvoice(billId) {
    this.salesService
      .fetchSalesBillDetailForInvoice(billId)
      .subscribe((res) => {
        this.salesBillDetails = res.data;
        this.productDetails = this.salesBillDetails.salesBillDetailsWithProd;

        console.log(
          this.productDetails.map((data) => {
            return data.creditReason;
          })
        );
      });
  }

  onSubmit() {
    let data = this.SelectedProductDetails;
    let billNo = this.billNo;
    let SN = this.serialNumber;
    this.commonService.setData({
      data,
      billNo,
      SN,
    });
    this.router.navigateByUrl('/dashboard/creditnoteInvoice');
  }
  onEnter(e: any) {
    let billNo = e.target.value;
    this.fetchSalesBillDetailForInvoice(billNo);
  }
}
