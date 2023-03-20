import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';

@Component({
  selector: 'app-sales-billing',
  templateUrl: './sales-billing.component.html',
  styleUrls: ['./sales-billing.component.css']
})
export class SalesBillingComponent {
  salesBill: SalesBill = new SalesBill();
  salesBills: SalesBill[] = []

  constructor(private salesBillService: SalesBillServiceService) { }

  ngOnInit() {
    this.salesBillService.getAllSalesBill().subscribe(data => {
      this.salesBills = data.data;
    })
  }

  createsalesBill() {

  }


}
