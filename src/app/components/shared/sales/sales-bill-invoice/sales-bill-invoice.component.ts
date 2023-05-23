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
  // @Input() billId !: number;

  salesInvoice: SalesBillInvoice = new SalesBillInvoice;
  printButtonVisiability: boolean = true;

  company: any;
  netAmount: number = 0;
  constructor(private salesBillService: SalesBillServiceService,
    private loginService: LoginService,
    private tostrService: ToastrService,
    private activatedRoute: ActivatedRoute, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let billId: number = this.activatedRoute.snapshot.params['billId'];
    this.fetchSalesBillInvoice(billId);
    this.company = this.loginService.getCompany();
    console.log("salebill init");



    // window.print();

  }

  fetchSalesBillInvoice(billId: number) {
    this.salesBillService.fetchSalesBillDetailForInvoice(billId).subscribe({
      next: (data: RJResponse<SalesBillInvoice>) => {
        this.salesInvoice = data.data;
        this.salesInvoice.salesBillDTO.totalAmount = this.salesInvoice.salesBillDTO.totalAmount;
        setTimeout(() => {
          this.salesInvoice.salesBillDetailsWithProd.forEach(prod => {
            this.netAmount += (prod.qty * prod.rate);
          })
        })
        // setTimeout(() => {
        //   const printContents = document.getElementById('printable-content')!.innerHTML;
        //   const originalContents = document.body.innerHTML;

        //   document.body.innerHTML = printContents;
        // })
      }
    })
  }


  printTheBill(billId: number) {
    this.printButtonVisiability = false;

    let userId = this.loginService.currentUser.user.id;

    this.salesBillService.printTheBill(billId, userId).subscribe({
      next: (data) => {
        console.log("bill is printed Successfully");
      },
      error: (error) => {
        console.log("error while printing bill");
      },
      complete: () => {
        // this.fetchSalesBillInvoice(billId);
        const printContents = document.getElementById('printable-content')!.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        this.printButtonVisiability = true;
        document.body.innerHTML = originalContents;
        // this.tostrService.success("bill is printed successfully")
        setTimeout(() => {
          window.close();
        }, 1500)
      }
    })
  }

  ngOnDestroy() {
    console.log("destorying sales-bill-invoice component")
  }

  goToBillListPage() {
    this.router.navigateByUrl("http://google.com")
  }


}
