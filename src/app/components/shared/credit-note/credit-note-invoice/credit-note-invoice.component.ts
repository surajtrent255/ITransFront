import { Component, ElementRef, ViewChild } from '@angular/core';

import { Product } from 'src/app/models/Product';
import { SalesBillDetailWithProdInfo } from 'src/app/models/SalesBillDetailWithProdInfo';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { ProductService } from 'src/app/service/product.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CommonService } from 'src/app/service/shared/common/common.service';

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
  Reason: { productId: number; reason: string }[] = [];
  QTY: { productId: number; qty: number }[] = [];
  ProductIds: number[] = [];

  totalAmount: { productId: number }[] = [];

  // for displaying data only
  serialNumber!: number;

  constructor(
    private commonService: CommonService,
    private salesService: SalesBillServiceService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    let date = new Date();
    this.date = this.commonService.formatDate(Number(date));

    this.commonService.data$.subscribe((data) => {
      this.serialNumber = data.SN;
      this.billNo = data.billNo;
      this.Reason = data.selectedProductReasons;
      this.QTY = data.changedQty;
      data.selectedProductIds.forEach((id) => {
        this.ProductIds.push(id);
      });
    });
    console.log(this.ProductIds);

    this.salesService
      .fetchSalesBillDetailForInvoice(this.billNo)
      .subscribe((res) => {
        this.salesInvoice = res.data;
        this.ProductIds.forEach((id) => {
          this.salesInvoice.salesBillDetailsWithProd.filter((data) => {
            if (data.productId === id) {
              this.SelectedProduct = this.salesInvoice.salesBillDetailsWithProd;
            }
          });
        });
      });
  }

  printTheBill(id: number) {}
}
