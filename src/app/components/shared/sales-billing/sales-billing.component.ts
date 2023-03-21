import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales-billing',
  templateUrl: './sales-billing.component.html',
  styleUrls: ['./sales-billing.component.css']
})
export class SalesBillingComponent {
  salesBillMaster: SalesBillMaster = new SalesBillMaster();
  salesBills: SalesBill[] = []
  constructor(private salesBillService: SalesBillServiceService, private loginService: LoginService) { }

  ngOnInit() {
    this.salesBillService.getAllSalesBill().subscribe(data => {
      this.salesBills = data.data;
    })

  }

  submitSalesBillForm() {
    this.salesBillMaster.amount = this.salesBillMaster.rate * this.salesBillMaster.qty;
    this.salesBillMaster.discount = this.salesBillMaster.discountPerUnit * this.salesBillMaster.qty;
    this.salesBillMaster.taxableAmount = this.salesBillMaster.amount - this.salesBillMaster.discount;
    this.salesBillMaster.taxAmount = 0.13 * this.salesBillMaster.taxableAmount;
    this.salesBillMaster.totalAmount = this.salesBillMaster.taxableAmount + this.salesBillMaster.taxAmount;
    this.salesBillMaster.billDate = new Date;
    this.salesBillMaster.syncWithIrd = true;
    this.salesBillMaster.isBillActive = true;
    this.salesBillMaster.enteredBy = this.loginService.currentUser.user.email;
    this.salesBillService.createNewSalesBill(this.salesBillMaster).subscribe(data => {
      console.log(data.data);
      Swal.fire("Sales Bill Created ! ", "A Sale bill has been created with id " + data.data, "success").then((id) => {
        console.log(id);
        this.salesBillMaster = new SalesBillMaster;
      })
    })
  }


}
