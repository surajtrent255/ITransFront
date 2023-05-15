import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Payment } from 'src/app/models/Payment/payment';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-payment-details',
  templateUrl: './edit-payment-details.component.html',
  styleUrls: ['./edit-payment-details.component.css'],
})
export class EditPaymentDetailsComponent {
  @Input() PaymentId!: number;
  @Output() updatedSuccessful = new EventEmitter<boolean>(false);

  paymentMode!: PaymentMode[];
  postDateCheckEnable!: boolean;
  cheque!: boolean;
  Payment: Payment = new Payment();
  datePickerEnable: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private commonService: CommonService,
    private LoginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.paymentService.getPaymentModeDetails().subscribe((res) => {
      this.paymentMode = res.data;
    });
  }

  ngOnChanges() {
    this.getPaymentDetailsById(this.PaymentId);
  }

  getPaymentDetailsById(sn: number) {
    this.paymentService.getPaymentDetailsById(sn).subscribe((res) => {
      this.Payment = res.data;
      this.Payment.postCheckDate = this.commonService.formatDate(
        Number(this.Payment.postCheckDate)
      );
      if (this.Payment.paymentModeId == 2) {
        this.cheque = true;
      }
      if (this.Payment.postDateCheck) {
        this.datePickerEnable = true;
      }
    });
  }

  postCheckDateChange(e: any) {
    if (e.target.value === 'true') {
      this.datePickerEnable = true;
    } else {
      this.datePickerEnable = false;
    }
  }
  paymentModeChange(data: string) {
    if (data === '2') {
      this.cheque = true;
    } else {
      this.cheque = false;
    }
  }
  editPaymentDetails() {
    this.paymentService.updatePaymentDetails(this.Payment).subscribe({
      next: (res) => {
        this.updatedSuccessful.emit(true);
        this.paymentService.getPaymentDetails(this.LoginService.getCompnayId());
      },
    });
  }

  cancel() {
    this.updatedSuccessful.emit(true);
  }
}
