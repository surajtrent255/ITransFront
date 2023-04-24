import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  @ViewChild('Total') Total!: ElementRef;
  @ViewChild('Tds') Tds!: ElementRef;

  PaymentForm = new FormGroup({
    companyId: new FormControl('', [Validators.required]),
    branchId: new FormControl('', [Validators.required]),
    partyId: new FormControl('', [Validators.required]),
    paymentModeId: new FormControl('', Validators.required),
    postCheckDate: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit() {}

  paymentFormSubmit() {
    console.log(this.PaymentForm.value);
    console.log(
      'Initial value of span tag:',
      this.Total.nativeElement.textContent
    );
    console.log('this is tds', this.Tds.nativeElement.textContent);
  }
}
