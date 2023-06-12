import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Payment } from 'src/app/models/Payment/payment';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { adToBs } from '@sbmdkl/nepali-date-converter';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  updatePayment!: Payment;
  paymentMode!: PaymentMode[];
  payment: Payment[] = [];
  loggedInCompanyId!: number;
  loggedInBranchId!: number;
  postDateCheckEnable: boolean = false;
  cheque!: boolean;

  paymentIdForEdit!: number;

  IsAuditor!: boolean;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  PaymentForm = new FormGroup({
    partyId: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    Tds: new FormControl('', [Validators.required]),
    postDateCheck: new FormControl(''),
    paymentModeId: new FormControl('', [Validators.required]),
    postCheckDate: new FormControl(''),
    checkNo: new FormControl(''),
    // NepaliDate: new FormControl(''),
  });

  constructor(
    private paymentService: PaymentService,
    private loginService: LoginService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.loggedInCompanyId = this.loginService.getCompnayId();
    this.loggedInBranchId = this.loginService.getBranchId();

    this.getPaymentdetails();

    this.paymentService.getPaymentModeDetails().subscribe((res) => {
      this.paymentMode = res.data;
    });
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }

    const date = adToBs('2023-06-07');
    console.log(date);
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedPayment();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedPayment();
    }
  }

  fetchLimitedPayment() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.paymentService
      .getLimitedPaymentDetails(
        offset,
        this.pageTotalItems,
        this.loggedInCompanyId,
        this.loggedInBranchId
      )
      .subscribe((res) => {
        if (res.data.length === 0 || res.data === undefined) {
          this.toastrService.error('payment details not found ');
          this.currentPageNumber -= 1;
        } else {
          this.payment = res.data;
        }
      });
  }

  getPaymentdetails() {
    this.paymentService
      .getPaymentDetails(this.loggedInCompanyId)
      .subscribe((res) => {
        this.payment = res.data;
      });
  }

  createPaymentDetails() {
    // date
    let date = new Date();
    let newdate = date.toJSON().slice(0, 10);

    // console.log(this.cheque, this.PaymentForm.value.checkNo);

    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    var englishDate = Input.value;

    if (this.cheque && Number(this.PaymentForm.value.checkNo) === 0) {
      this.toastrService.error('Please enter Checkno');
    } else {
      this.paymentService
        .addPaymentDetails({
          sn: 0,
          companyId: this.loggedInCompanyId,
          branchId: this.loggedInBranchId,
          partyId: Number(this.PaymentForm.value.partyId!),
          amount: Number(this.PaymentForm.value.amount!),
          paymentModeId: Number(this.PaymentForm.value.paymentModeId!),
          tdsDeducted: Number(this.PaymentForm.value.Tds!),
          postDateCheck: this.postDateCheckEnable,
          date: newdate,
          postCheckDate: englishDate,
          checkNo: Number(this.PaymentForm.value.checkNo!) || 0,
          paymentStatus: true,
          postDateCheckStatus: true,
          postCheckDateNepali: nepaliDate,
          nepaliDate: String(adToBs(newdate)),
        })
        .subscribe({
          complete: () => {
            this.getPaymentdetails();
          },
          next: () => {
            this.PaymentForm.reset();
          },
        });
    }
  }

  postCheckDate(e: any) {
    if (e.target.value === 'true') {
      this.postDateCheckEnable = true;
    }
  }
  paymentModeChange(data: string) {
    if (data === '2') {
      this.cheque = true;
    } else {
      this.cheque = false;
      this.postDateCheckEnable = false;
    }
  }

  editPayment(sn: number) {
    this.paymentIdForEdit = sn;
  }

  change(e: any) {
    console.log(e);
  }

  deletePayment(Sn: number) {
    this.paymentService.deleteFromPaymentDetails(Sn).subscribe({
      complete: () => {
        this.getPaymentdetails();
      },
    });
  }

  getDetails() {
    this.getPaymentdetails();
  }
}
