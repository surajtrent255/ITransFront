import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'src/app/models/Product';
import { SalesBillDetailWithProdInfo } from 'src/app/models/SalesBillDetailWithProdInfo';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { ProductService } from 'src/app/service/product.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-credit-note-invoice',
  templateUrl: './credit-note-invoice.component.html',
  styleUrls: ['./credit-note-invoice.component.css'],
})
export class CreditNoteInvoiceComponent {
  billNo!: number;
  SelectedProduct: SalesBillDetailWithProdInfo[] = [];
  salesInvoice: SalesBillInvoice = new SalesBillInvoice();
  date!: string;

  totalAmount!: number;
  TotalTax!: number;

  // for displaying data only
  serialNumber!: number;

  constructor(
    private commonService: CommonService,
    private salesService: SalesBillServiceService,
    private creditNoteService: CreditNoteService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    let date = new Date();
    this.date = this.commonService.formatDate(Number(date));

    this.commonService.data$.subscribe((data) => {
      this.serialNumber = data.SN;
      this.billNo = data.billNo;
      this.SelectedProduct = data.data;
    });

    const total = this.SelectedProduct.map((item) => {
      return item.qty * (item.rate + (item.rate * item.taxRate) / 100);
    });

    const NetTotal = total.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    const totalTaxAmount = this.SelectedProduct.map((item) => {
      return (item.rate * item.taxRate) / 100;
    });

    const NetTaxAmount = totalTaxAmount.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    this.totalAmount = NetTotal;
    this.TotalTax = NetTaxAmount;

    this.salesService
      .fetchSalesBillDetailForInvoice(this.billNo)
      .subscribe((res) => {
        this.salesInvoice = res.data;
      });
  }

  exportToExcel() {
    // const downloadLink = document.createElement('a');
    // const datatype = 'application/vnd.ms-excel';
    // const table = document.getElementById('httptrace-table');
    // const tableHtml = table?.outerHTML.replace(/ /g, '%20');
    // document.body.appendChild(downloadLink);
    // downloadLink.href = 'data:' + datatype + ' ' + tableHtml;
    // downloadLink.download = 'httptrace.xls';
    // downloadLink.click();

    const table = document.getElementById('httptrace-table');

    // Define the tableExport variable
    const tableExport: any = window['tableExport'];

    // Initialize tableExport with the table element
    const exportInstance = new tableExport.default(table, {
      exportButtons: false, // Hide the export buttons
    });

    // Generate the Excel file
    exportInstance.exportToExcel();

    // Cleanup tableExport instance
    exportInstance.reset();
  }

  submit() {
    this.SelectedProduct.map((data) => {
      this.creditNoteService
        .addCreditNoteDetails({
          serialNumber: this.serialNumber,
          companyId: this.loginService.getCompnayId(),
          creditAmount: data.rate,
          creditReason: data.creditReason,
          creditTaxAmount: (data.rate * data.taxRate) / 100,
          productId: data.productId,
          productName: data.productName,
          branchId: this.loginService.getBranchId(),
          billNumber: this.salesInvoice.salesBillDTO.billNo,
        })
        .subscribe((res) => {});
    });

    this.creditNoteService
      .addCreditNote({
        billNumber: this.salesInvoice.salesBillDTO.billNo,
        customerAddress: this.salesInvoice.customerAddress,
        customerName: this.salesInvoice.salesBillDTO.customerName,
        date: new Date(),
        panNumber: this.salesInvoice.salesBillDTO.customerPan,
        totalAmount: this.totalAmount,
        totalTax: this.TotalTax,
        id: this.serialNumber,
        companyId: this.loginService.getCompnayId(),
        branchId: this.loginService.getBranchId(),
      })
      .subscribe((res) => {
        this.router.navigateByUrl('/dashboard/creditNoteList');
      });
  }
}
