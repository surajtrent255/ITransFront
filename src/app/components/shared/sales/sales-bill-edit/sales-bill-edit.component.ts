import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';

@Component({
  selector: 'app-sales-bill-edit',
  templateUrl: './sales-bill-edit.component.html',
  styleUrls: ['./sales-bill-edit.component.css']
})
export class SalesBillEditComponent {

  @Output() activeSalesBillEditEvent = new EventEmitter<boolean>();

  deactivateSalesBillEdit() {
    this.activeSalesBillEditEvent.emit(false);
  }
  constructor(private salesBillService: SalesBillServiceService, private activatedRoute: ActivatedRoute) {
  }

  salesBillInvoice !: SalesBillInvoice;

  ngOnInit() {
    let billNo = this.activatedRoute.snapshot.params['billNo']
    let compaId = this.activatedRoute.snapshot.params['companyId']
    console.log(this.activatedRoute.snapshot.params)
    console.log("billNo = " + billNo);
    console.log("companyId = " + compaId)
    this.salesBillService.fetchSalesBillDetailForInvoice(billNo, 0).subscribe(data => {

      this.salesBillInvoice = data.data;

    })
  }
  ngOnDestroy() {
    console.log("destorying sales-bill-edit component")
  }
}
