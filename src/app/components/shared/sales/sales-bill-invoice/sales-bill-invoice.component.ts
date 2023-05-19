import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import Swal from 'sweetalert2';
import { NumberToWordTransformPipe } from 'src/app/custompipes/number-to-word-transform.pipe';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/service/shared/login.service';
import { RJResponse } from 'src/app/models/rjresponse';
import { ToastrService } from 'ngx-toastr';
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
  printButtonVisiability: boolean = true;

  constructor(private salesBillService: SalesBillServiceService, private loginService: LoginService, private tostrService: ToastrService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    let billId: number = this.activatedRoute.snapshot.params['billId'];
    this.fetchSalesBillInvoice(billId);
    console.log("salebill init");
  }

  fetchSalesBillInvoice(billId: number) {
    this.salesBillService.fetchSalesBillDetailForInvoice(billId).subscribe({
      next: (data: RJResponse<SalesBillInvoice>) => {
        this.salesInvoice = data.data;
        this.salesInvoice.salesBillDTO.totalAmount = this.salesInvoice.salesBillDTO.totalAmount;

      }
    })
  }



  printTheBill(billId: number) {
    this.printButtonVisiability = false;

    let userId = this.loginService.currentUser.user.id;

    this.salesBillService.printTheBill(billId, userId).subscribe({
      next: (data) => {
        this.tostrService.success("bill is printed successfully ")
        console.log("bill is printed Successfully");
      },
      error: (error) => {
        console.log("error while printing bill");
      },
      complete: () => {
        // this.fetchSalesBillInvoice(billId);
        // this.router.navigateByUrl(`dashboard/salesbill`);
        const printContents = document.getElementById('printable-content')!.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        this.printButtonVisiability = true;
        document.body.innerHTML = originalContents;
      }
    })


  }

  ngOnDestroy() {
    console.log("destorying sales-bill-invoice component")
  }

}
