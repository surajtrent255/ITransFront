import { Component } from '@angular/core';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-debit-note-invoice',
  templateUrl: './debit-note-invoice.component.html',
  styleUrls: ['./debit-note-invoice.component.css'],
})
export class DebitNoteInvoiceComponent {
  billNo!: number;
  salesInvoice: SalesBillInvoice = new SalesBillInvoice();
  constructor(
    private commonService: CommonService,
    private salesService: SalesBillServiceService
  ) {}

  ngOnInit() {
    this.commonService.data$.subscribe((data) => {
      console.log('JKKKJJK');
      this.billNo = data.billNo;
      console.log(data.billNo);
    });

    this.salesService
      .fetchSalesBillDetailForInvoice(this.billNo)
      .subscribe((res) => {
        this.salesInvoice = res.data;
      });
  }

  printTheBill(id: number) {}
}
