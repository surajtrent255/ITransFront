import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
  ADD_PAYMENT_DETAILS,
  GET_PAYMENT_DETAILS,
  GET_PAYMENT_MODE,
} from 'src/app/constants/urls';
import { Payment } from 'src/app/models/Payment/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  addPaymentDetails(payment: Payment): Observable<any> {
    return this.http.post(ADD_PAYMENT_DETAILS, payment).pipe(
      tap({
        next: (response) => {
          console.log(response);
          this.toastrService.success('payment Details Added Successfully');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error('Error Creating PaymentDetails');
        },
      })
    );
  }

  getPaymentDetails(companyId: number): Observable<any> {
    return this.http.get(`${GET_PAYMENT_DETAILS}?companyId=${companyId}`);
  }
  getPaymentDetailsById(SN: number): Observable<any> {
    return this.http.get(`${GET_PAYMENT_DETAILS}/${SN}`);
  }

  getPaymentModeDetails(): Observable<any> {
    return this.http.get(GET_PAYMENT_MODE);
  }

  deleteFromPaymentDetails(paymentId: number) {
    return this.http.delete(`${GET_PAYMENT_DETAILS}/${paymentId}`);
  }
}
