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
    console.log(this.selectedProductIds);
    // this.SelectedProductDetails.map(data=>{
    //   this.totalAmount = data.rate +
    // })
  }

  reasonchange(productId: number, e: any) {
    const index = this.selectedProductReasons.findIndex(
      (item) => item.productId === productId
    );
    if (index === -1) {
      this.selectedProductReasons.push({
        productId: productId,
        reason: e.target.value,
      });
    } else {
      this.selectedProductReasons[index].reason = e.target.value;
    }
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
    console.log(this.reason);
    console.log(this.SelectedProductDetails);
    let reason = this.SelectedProductDetails.map((data) => {
      data.creditReason;
    });

    if (this.SelectedProductDetails.length !== 0) {
      this.creditNoteService
        .addCreditNote({
          billNumber: this.salesBillDetails.salesBillDTO.billNo,
          customerAddress: this.salesBillDetails.customerAddress,
          customerName: this.salesBillDetails.salesBillDTO.customerName,
          date: new Date(),
          panNumber: this.salesBillDetails.salesBillDTO.customerPan,
          sn: this.serialNumber,
          totalTax: 10000,
          totalAmount: 10000,
        })
        .subscribe({
          next: (res) => {
            console.log(res);
            this.selectedProductIds = [];
            this.SelectedProductDetails = [];
            this.selectedProductReasons = [];
          },
        });

      this.SelectedProductDetails.map((data) => {
        this.creditNoteService
          .addCreditNoteDetails({
            creditAmount: data.rate,
            creditReason: 'Resaon',
            creditTaxAmount: (data.rate * data.taxRate) / 100,
            productId: data.productId,
            productName: data.productName,
            SN: 0,
          })
          .subscribe({
            next: (res) => {
              this.selectedProductIds = [];
              this.SelectedProductDetails = [];
              this.selectedProductReasons = [];
              console.log(res);
            },
          });
      });
      this.SelectedProductDetails = [];
    }

    // let selectedProductReasons = this.selectedProductReasons;
    // let selectedProductIds = this.selectedProductIds;
    // let billNo = this.billNo;
    // let changedQty = this.selectedProductQTY;
    // let SN = this.serialNumber;
    // this.commonService.setData({
    //   selectedProductReasons,
    //   selectedProductIds,
    //   billNo,
    //   changedQty,
    //   SN,
    // });
    // this.router.navigateByUrl('/dashboard/creditnoteInvoice');
  }
  onEnter(e: any) {
    let billNo = e.target.value;
    this.fetchSalesBillDetailForInvoice(billNo);
  }

  // calculateTotal(e: any, rate: number, taxRate: number, productId: number) {
  //   console.log(e.target.value, productId);
  //   this.selectedProductQTY = {
  //     productId: productId,
  //     qty: Number(e.target.value),
  //   };

  // this.salesBillDetails.salesBillDetailsWithProd.filter((data) => {
  //   if (data.productId === productId) {
  //     this.total =this.salesBillDetails.salesBillDetailsWithProd.map(data =>{
  //       return data.rate + (data.rate * data.taxRate/100);
  //     });
  //   }
  // });
  // console.log(this.selectedProductQTY);
  // this.qty = e.target.value;
  // this.total = Number(e.target.value) * (rate + (rate * taxRate) / 100);
  // let qty = e.target.value;

  // if (qty) {
  //   const index = this.selectedProductQTY.findIndex(
  //     (item) => item.productId === productId
  //   );
  //   if (index === -1) {
  //     this.selectedProductQTY.push({
  //       productId: productId,
  //       qty: e.target.value,
  //     });
  //   } else {
  //     this.selectedProductQTY[index].qty = e.target.value;
  //   }
  // }
  // }

  // getProductsByProductIds
  // fetchSalesBillDetailForInvoice
}
