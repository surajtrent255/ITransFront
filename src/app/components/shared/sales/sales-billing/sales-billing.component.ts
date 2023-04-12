import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
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
  styleUrls: ['./sales-billing.component.css']
})
export class SalesBillingComponent {

  activeSaleBillInvoice: boolean = false;
  activeSalesBillEntry: boolean = false;

  loggedUser: User = new User;
  invoiceInfo !: SalesBillInvoice;

  salesBills: SalesBill[] = [];
  customerId !: number;
  activeSalesBillEdit: boolean = false;

  companyId !: number;
  branchId !: number;
  constructor(private salesBillService: SalesBillServiceService, private loginService: LoginService, private router: Router) { }


  ngOnInit() {
    console.log("sales-billingbasecomp")
    this.loggedUser = JSON.parse(localStorage.getItem("User")!);
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getSalesBillForCompanyBranch();
  }

  getSalesBillForCompanyBranch() {
    this.salesBillService.getAllSalesBill(this.companyId, this.branchId).subscribe(data => {
      this.salesBills = data.data;
    })
  }
  ApproveTheBill(id: number) {
    this.salesBillService.approveTheBill(id).subscribe({
      next: (data) => { },
      complete: () => {
        this.getSalesBillForCompanyBranch();
      }
    })
  }

  cancelTheBill(id: number) {
    this.salesBillService.cancelTheBill(id).subscribe({
      complete: () => {
        this.getSalesBillForCompanyBranch();
      }
    });
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
    this.customerId = $event
  }


  viewSaleBillDetail(billNo: number, companyId: number) {
    alert(companyId)
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
      confirmButtonText: 'Yes, make sale !'
    }).then((result) => {
      if (result.isConfirmed) {
        continueSelling();
      }
    })

    const continueSelling = () => {
      console.log("continue selling")
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
      let taxAmount = 13 / 100 * taxableAmount;
      let totalAmount = taxableAmount + taxAmount;


      let salesBill: SalesBill = new SalesBill;
      let salesBillMaster: SalesBillMaster = new SalesBillMaster;
      salesBill.amount = amount;
      salesBill.discount = discount;
      salesBill.taxableAmount = taxableAmount;
      salesBill.taxAmount = taxAmount;
      salesBill.totalAmount = totalAmount;
      salesBill.customerId = this.customerId;
      salesBill.customerName = "xyz mohit";
      // salesBill.customerPan = this.cus
      salesBill.syncWithIrd = false;
      salesBill.enteredBy = this.loggedUser.user.email;
      salesBill.paymentMethod = "CashInHand";
      console.log(salesBill.customerId)
      console.log("^^^^^^^^^^^^")
      salesBill.userId = this.loggedUser.user.id;
      salesBill.companyId = this.loginService.getCompnayId();;
      salesBill.realTime = true;
      salesBill.billActive = true;


      salesBillMaster.salesBillDTO = salesBill;
      salesBillMaster.salesBillDetails = salesBillDetailInfos;
      Swal.fire({
        title: 'please wait ...!',
        text: 'products are being sold out !!!',
        showCancelButton: false,
        showConfirmButton: false
      })
      console.log(salesBillMaster)
      console.log("slaebillmaster above");
      this.salesBillService.createNewSalesBill(salesBillMaster).subscribe(data => {
        Swal.fire({
          title: 'Produts have been sold',
          text: 'click ok button to watch invoice',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: true
        }).then(
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
        )
      }, (error) => {
        Swal.fire({
          title: 'error occured',
          text: 'something went wrong while creating sales',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: true
        })
      });
    }
  }

  printTheBill($event: string) {
    let userId = this.loggedUser.user.id;
    let billNo = $event;
    this.salesBillService.printTheBill(billNo, userId).subscribe((data) => {
      console.log(data.data);
      Swal.fire({
        title: 'Done !',
        text: 'printing info is updated successfully',
        icon: 'success',
        showConfirmButton: true
      }).then(() => {
        this.activeSalesBillEntry = false;
        this.activeSaleBillInvoice = false;
      })
    }, (error) => {
      Swal.fire({
        title: 'Error occured',
        text: 'Error has been occured while printing the bill',
        icon: 'error',
        showCancelButton: true,
      })
    })
  }

  createNewSaleBill() {
    this.router.navigateByUrl("dashboard/salesbill/create")
  }
}

