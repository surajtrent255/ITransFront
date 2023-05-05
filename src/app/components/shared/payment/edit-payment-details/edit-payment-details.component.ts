import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Payment } from 'src/app/models/Payment/payment';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';

@Component({
  selector: 'app-edit-payment-details',
  templateUrl: './edit-payment-details.component.html',
  styleUrls: ['./edit-payment-details.component.css'],
})
export class EditPaymentDetailsComponent {
  paymentMode!: PaymentMode[];
  loggedInCompanyId!: number;
  loggedInBranchId!: number;
  postDateCheckEnable!: boolean;
  cheque!: boolean;
  Payment: Payment = new Payment();
  datePickerEnable!: boolean;

  @Input() PaymentId!: number;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.paymentService.getPaymentModeDetails().subscribe((res) => {
      console.log(res.data);
      this.paymentMode = res.data;
    });
  }

  ngOnChanges() {
    this.getPaymentDetailsById(this.PaymentId);
  }

  getPaymentDetailsById(sn: number) {
    this.paymentService.getPaymentDetailsById(sn).subscribe((res) => {
      this.Payment = res.data;
      if (this.Payment.paymentModeId == 2) {
        this.cheque = true;
      }
      if (this.Payment.postDateCheck === 'true') {
        this.postDateCheckEnable = true;
      } else {
        this.postDateCheckEnable = false;
      }
    });
  }

  postCheckDateChange(e: any) {
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
  editPaymentDetails() {}
}
