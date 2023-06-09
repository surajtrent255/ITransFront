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
import { NgxNepaliNumberToWordsService } from 'src/app/utils/nepaliNumerToWord/ngx-nepali-number-to-words.service';
import { User } from 'src/app/models/user';
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
  totalAmountInWordsBeforeDecimal !: string;
  totalAmountInWordsAfterDecimal !: string;

  user !: User;

  constructor(private salesBillService: SalesBillServiceService,
    private loginService: LoginService,
    private tostrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private nepaliNumbberToWord: NgxNepaliNumberToWordsService) { }

  ngOnInit() {
    this.user = this.loginService.currentUser
    let billId: number = this.activatedRoute.snapshot.params['billId'];
    this.fetchSalesBillInvoice(billId);
    this.company = this.loginService.getCompany();


    // this.salesInvoice.salesBillDTO.totalAmount

    // window.print();

  }

  fetchSalesBillInvoice(billId: number) {
    this.salesBillService.fetchSalesBillDetailForInvoice(billId).subscribe({
      next: (data: RJResponse<SalesBillInvoice>) => {
        this.salesInvoice = data.data;

        // let tAmount = this.salesInvoice.salesBillDTO.totalAmount;
        let tAmount = 100.0;

        this.totalAmountInWordsBeforeDecimal = this.nepaliNumbberToWord.toWords(Math.floor(tAmount));
        this.totalAmountInWordsAfterDecimal = this.nepaliNumbberToWord.toWords((tAmount % 1).toFixed(2).substring(2))

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
