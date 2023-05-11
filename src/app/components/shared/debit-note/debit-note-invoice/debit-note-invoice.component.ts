import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseBillDetailWithProdInfo } from 'src/app/models/PurchaseBillDetailWithProdInfo';
import { PurchaseBillInvoice } from 'src/app/models/PurchaseBillInvoice';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { DebitNoteService } from 'src/app/service/shared/Debit-Note/debit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-debit-note-invoice',
  templateUrl: './debit-note-invoice.component.html',
  styleUrls: ['./debit-note-invoice.component.css'],
})
export class DebitNoteInvoiceComponent {
  billNo!: number;
  date!: string;
  SelectedProduct: PurchaseBillDetailWithProdInfo[] = [];
  purchaseInvoice!: PurchaseBillInvoice;
  serialNumber!: number;
  totalAmount!: number;

  constructor(
    private commonService: CommonService,
    private PurchaseService: PurchaseBillService,
    private LoginService: LoginService,
    private router: Router,
    private debitNoteService: DebitNoteService
  ) {}

  ngOnInit() {
    let date = new Date();
    this.date = this.commonService.formatDate(Number(date));

    this.commonService.data$.subscribe((data) => {
      console.log('JKKKJJK');
      this.billNo = data.billNo;
      this.serialNumber = data.SN;
      this.SelectedProduct = data.data;
      console.log(data);
    });

    const total = this.SelectedProduct.map((item) => {
      return item.qty * item.rate;
    });
    const NetTotal = total.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    this.totalAmount = NetTotal;

    this.PurchaseService.fetchPurchaseBillDetailForInvoice(
      this.billNo,
      this.LoginService.getCompnayId(),
      this.LoginService.getBranchId()
    ).subscribe((res) => {
      this.purchaseInvoice = res.data;
    });
  }

  submit() {
    this.SelectedProduct.map((data) => {
      this.debitNoteService
        .addDebitNoteDetails({
          debitAmount: data.rate,
          debitReason: data.debitReason,
          debitTaxAmount: 0,
          productId: data.productId,
          productName: data.productName,
          SN: this.serialNumber,
          companyId: this.LoginService.getCompnayId(),
        })
        .subscribe((res) => {});
    });

    this.debitNoteService
      .addDebitNote({
        billNumber: String(this.purchaseInvoice.purchaseBillDTO.purchaseBillNo),
        date: new Date(),
        id: this.serialNumber,
        panNumber: this.purchaseInvoice.purchaseBillDTO.sellerPan,
        receiverAddress: '',
        receiverName: this.purchaseInvoice.purchaseBillDTO.sellerName,
        totalAmount: this.totalAmount,
        totalTax: 0,
        companyId: this.LoginService.getCompnayId(),
      })
      .subscribe((res) => {
        this.router.navigateByUrl('/dashboard/debitnote');
      });
  }
  cancel() {
    this.router.navigateByUrl('/dashboard/debitnote');
  }
}
