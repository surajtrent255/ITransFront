import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Payment } from 'src/app/models/Payment/payment';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

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
    let roles = localStorage.getItem('CompanyRoles');
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }
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

    console.log(this.cheque, this.PaymentForm.value.checkNo);

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
          postCheckDate: this.PaymentForm.value.postCheckDate! || '',
          checkNo: Number(this.PaymentForm.value.checkNo!) || 0,
          paymentStatus: true,
          postDateCheckStatus: true,
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
