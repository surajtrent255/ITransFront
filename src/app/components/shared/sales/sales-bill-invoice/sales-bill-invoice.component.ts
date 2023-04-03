import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import Swal from 'sweetalert2';
import { NumberToWordTransformPipe } from 'src/app/custompipes/number-to-word-transform.pipe';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/service/shared/login.service';
import { RJResponse } from 'src/app/models/rjresponse';
@Component({
  selector: 'app-sales-bill-invoice',
  templateUrl: './sales-bill-invoice.component.html',
  styleUrls: ['./sales-bill-invoice.component.css']
})
export class SalesBillInvoiceComponent {

  // @Input()
  // salesInvoice: SalesBillInvoice = new SalesBillInvoice;

  // @Output() billNoEvent = new EventEmitter<number>();

  // @Output() activeSalesBillInvoiceEvent = new EventEmitter<boolean>();
  salesInvoice: SalesBillInvoice = new SalesBillInvoice;


  constructor(private salesBillService: SalesBillServiceService, private loginService: LoginService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let billNo: number = this.activatedRoute.snapshot.params['billNo'];
    let companyId: number = this.activatedRoute.snapshot.params['companyId'];
    this.fetchSalesBillInvoice(billNo, companyId);
    console.log("salebill init");


  }

  fetchSalesBillInvoice(billNo: number, companyId: number) {
    this.salesBillService.fetchSalesBillDetailForInvoice(billNo, companyId).subscribe({
      next: (data: RJResponse<SalesBillInvoice>) => {
        this.salesInvoice = data.data;
        this.salesInvoice.salesBillDTO.totalAmount = Math.round(this.salesInvoice.salesBillDTO.totalAmount);

      }
    })
  }



  printTheBill(bill_no: number) {
    let userId = this.loginService.currentUser.user.id;
    let billNo = bill_no;
    this.salesBillService.printTheBill(billNo, userId).subscribe({
      next: (data) => {
        alert("bill is printed successfully")
        console.log("bill is printed Successfully");
      },
      error: (error) => {
        console.log("error while printing bill");
      }
    })
  }

  ngOnDestroy() {
    console.log("destorying sales-bill-invoice component")
  }

}
