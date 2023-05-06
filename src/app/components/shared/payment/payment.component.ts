import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Payment } from 'src/app/models/Payment/payment';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';
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
  postDateCheckEnable!: boolean;
  cheque!: boolean;
  
  paymentIdForEdit!: number;

  IsAuditor!: boolean;

  PaymentForm = new FormGroup({
    partyId: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    Tds: new FormControl('', [Validators.required]),
    postDateCheck: new FormControl('', [Validators.required]),
    paymentModeId: new FormControl('', [Validators.required]),
    postCheckDate: new FormControl(''),
    checkNo: new FormControl(''),
    // NepaliDate: new FormControl(''),
  });

  constructor(
    private paymentService: PaymentService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loggedInCompanyId = this.loginService.getCompnayId();
    this.loggedInBranchId = this.loginService.getBranchId();

    this.getPaymentdetails();

    this.paymentService.getPaymentModeDetails().subscribe((res) => {
      console.log(res.data);
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
    console.log(date);
    let newdate = date.toJSON().slice(0, 10);

    this.paymentService
      .addPaymentDetails({
        sn: 0,
        companyId: this.loggedInCompanyId,
        branchId: this.loggedInBranchId,
        partyId: Number(this.PaymentForm.value.partyId!),
        amount: Number(this.PaymentForm.value.amount!),
        paymentModeId: Number(this.PaymentForm.value.paymentModeId!),
        tdsDeducted: Number(this.PaymentForm.value.Tds!),
        postDateCheck: this.PaymentForm.value.postDateCheck!,
        date: newdate,
        postCheckDate: this.PaymentForm.value.postCheckDate! || '',
        checkNo: Number(this.PaymentForm.value.checkNo!) || 0,
        status: true,
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

  postCheckDate(e: any) {
    if (e.target.value === 'true') {
      this.postDateCheckEnable = true;
    } else {
      this.postDateCheckEnable = false;
    }
  }
  paymentModeChange(data: string) {
    if (data === '2') {
      this.cheque = true;
    } else {
      this.cheque = false;
    }
  }

  editPayment(sn: number) {
    console.log(sn);
    this.paymentIdForEdit = sn;
  }

  deletePayment(Sn: number) {
    this.paymentService.deleteFromPaymentDetails(Sn).subscribe({
      complete: () => {
        this.getPaymentdetails();
      },
    });
  }
}
