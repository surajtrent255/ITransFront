import {
  Component,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import { User } from 'src/app/models/user';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sales-billing',
  templateUrl: './sales-billing.component.html',
  styleUrls: ['./sales-billing.component.css'],
})
export class SalesBillingComponent {
  activeSaleBillInvoice: boolean = false;
  activeSalesBillEntry: boolean = false;
  IsAuditor!: boolean;

  loggedUser: User = new User();
  invoiceInfo!: SalesBillInvoice;

  salesBills: SalesBill[] = [];
  customerId!: number;
  activeSalesBillEdit: boolean = false;
  confirmAlertDisplay: boolean = false;
  cancelBillId!: number;
  billPrintComponent: boolean = false;
  billId!: number;

  companyId!: number;
  branchId!: number;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  searchBy: string = 'bill_no';
  searchWildCard: string = '';

  sortBy: string = 'id';

  constructor(
    private salesBillService: SalesBillServiceService,
    private loginService: LoginService,
    private router: Router,
    private renderer: Renderer2,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.loginService.userObservable.subscribe((user) => {
      this.loggedUser = user;
    });
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    // this.getSalesBillForCompanyBranch();
    this.fetchLimitedSalesBill();
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }
  }

  getSalesBillForCompanyBranch() {
    this.salesBillService
      .getAllSalesBill(this.companyId, this.branchId)
      .subscribe((data) => {
        this.salesBills = data.data;
      });
  }
  ApproveTheBill(id: number) {
    this.router.navigateByUrl(`dashboard/salesbill/create?id=${id}`);
    // this.salesBillService.approveTheBill(id).subscribe({
    //   next: (data) => { },
    //   complete: () => {
    //     this.getSalesBillForCompanyBranch();
    //   }
    // })
  }

  cancelTheBill(id: number) {
    this.confirmAlertDisplay = true;
    this.cancelBillId = id;
    const confirmAlertBtn = document.getElementById(
      'confirmAlert'
    ) as HTMLButtonElement;
    confirmAlertBtn.click();
  }

  continuingCancelling(id: number) {
    this.salesBillService.cancelTheBill(id).subscribe({
      complete: () => {
        this.getSalesBillForCompanyBranch();
      },
    });
  }

  destroyConfirmAlertSectionEmitter($event: boolean) {
    this.confirmAlertDisplay = false;

    if ($event === true) {
      this.continuingCancelling(this.cancelBillId);
    }
  }

  activateSalesBillEntry() {
    this.activeSalesBillEntry = true;
  }
  deactivateSalesBillEntry($event: boolean) {
    this.activeSalesBillEntry = $event;
  }

  activateSalesBillEdit(number: number) {
    this.activeSalesBillEdit = true;
  }

  deactivateSalesBillEdit($event: boolean) {
    this.activeSalesBillEdit = $event;
  }

  deactivateSalesBillInvoice($event: boolean) {
    this.activeSaleBillInvoice = $event;
  }

  setCustomerId($event: number) {
    this.customerId = $event;
  }

  viewSaleBillDetail(billNo: number, companyId: number) {
    this.router.navigate[`salesbill/${billNo}/${companyId}`];
  }
  saleTheProducts(saleBillDetails: SalesBillDetail[]) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, make sale !',
    }).then((result) => {
      if (result.isConfirmed) {
        continueSelling();
      }
    });

    const continueSelling = () => {
      console.log('continue selling');
      let salesBillDetailInfos = saleBillDetails;
      let amount = 0;
      let discount = 0;
      if (salesBillDetailInfos.length > 0) {
        for (let i = 0; i < salesBillDetailInfos.length; i++) {
          let prod = salesBillDetailInfos[i];
          amount += prod.qty * prod.rate;
          discount += prod.qty * prod.discountPerUnit;
        }
      }
      let taxableAmount = amount - discount;
      let taxAmount = (13 / 100) * taxableAmount;
      let totalAmount = taxableAmount + taxAmount;

      let salesBill: SalesBill = new SalesBill();
      let salesBillMaster: SalesBillMaster = new SalesBillMaster();
      salesBill.amount = amount;
      salesBill.discount = discount;
      salesBill.taxableAmount = taxableAmount;
      salesBill.taxAmount = taxAmount;
      salesBill.totalAmount = totalAmount;
      salesBill.customerId = this.customerId;
      salesBill.customerName = 'xyz mohit';
      // salesBill.customerPan = this.cus
      salesBill.syncWithIrd = false;
      salesBill.enteredBy = this.loggedUser.user.email;
      salesBill.paymentMethod = 'CashInHand';
      console.log(salesBill.customerId);
      console.log('^^^^^^^^^^^^');
      salesBill.userId = this.loggedUser.user.id;
      salesBill.companyId = this.loginService.getCompnayId();
      salesBill.realTime = true;
      salesBill.billActive = true;

      salesBillMaster.salesBillDTO = salesBill;
      salesBillMaster.salesBillDetails = salesBillDetailInfos;
      Swal.fire({
        title: 'please wait ...!',
        text: 'products are being sold out !!!',
        showCancelButton: false,
        showConfirmButton: false,
      });
      console.log(salesBillMaster);
      console.log('slaebillmaster above');
      this.salesBillService.createNewSalesBill(salesBillMaster).subscribe(
        (data) => {
          Swal.fire({
            title: 'Produts have been sold',
            text: 'click ok button to watch invoice',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: true,
          })
            .then
            // () => {
            //   this.salesBillService.fetchSalesBillDetailForInvoice(data.data, salesBill.companyId).subscribe(data => {

            //     this.activeSalesBillEntry = false;
            //     this.invoiceInfo = data.data;
            //     this.activeSaleBillInvoice = true;

            //   }, (error) => {
            //     Swal.fire({
            //       title: 'error occured',
            //       text: 'something went wrong while creating invoice',
            //       icon: 'error',
            //       showCancelButton: true,
            //       showConfirmButton: true
            //     })
            //   })
            // }
            ();
        },
        (error) => {
          Swal.fire({
            title: 'error occured',
            text: 'something went wrong while creating sales',
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: true,
          });
        }
      );
    };
  }

  createNewSaleBill() {
    this.router.navigateByUrl('dashboard/salesbill/create');
  }

  goForPrint(id: number) {
    // this.router.navigateByUrl(`dashboard/salesbill/invoice/${id}`);
    // window.open(`dashboard/salesbill/invoice/${id}`, "_blank", "height=1000, width=1000, left=250, top=100");

    window.open(
      `salesBillPrint/${id}`,
      '_blank',
      'height=900, width=900, left=250, top=100'
    );
    this.router.navigateByUrl(`dashboard/salesbill`);

    // window.focus();
  }

  openNewBrowser() {
    const newWindow = this.renderer.createElement('a');
    newWindow.href = 'https://www.example.com'; // Replace with the desired URL
    newWindow.target = '_blank';
    this.renderer.appendChild(document.body, newWindow);
    newWindow.click();
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedSalesBill();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedSalesBill();
    }
  }

  fetchLimitedSalesBill() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset)
    this.salesBillService
      .getLimitedSalesBill(
        offset,
        this.pageTotalItems,
        this.searchBy,
        this.searchWildCard,
        this.sortBy,
        this.companyId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.salesBills = [];
          this.toastrService.error('bills not found ');
          // this.currentPageNumber -= 1;
        } else {
          this.salesBills = res.data;
        }
      });
  }

  // goToBillPrint(id: number) {
  //   this.billPrintComponent = true;
  //   this.billId = id;
  // }
}
