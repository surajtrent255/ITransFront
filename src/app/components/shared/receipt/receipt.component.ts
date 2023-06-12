import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { Receipts } from 'src/app/models/Receipt';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';
import { ReceiptService } from 'src/app/service/shared/Receipt/receipt.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent {
  receipts: Receipts[] = [];
  companyId!: number;
  branchId!: number;
  postDateCheckEnable!: boolean;
  paymentMode!: PaymentMode[];
  IsAuditor!: boolean;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  ReciptForm = new FormGroup({
    partyId: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    Tds: new FormControl('', [Validators.required]),
    postDateCheck: new FormControl('', [Validators.required]),
    paymentModeId: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    // NepaliDate: new FormControl(''),
  });

  constructor(
    private receiptService: ReceiptService,
    private loginService: LoginService,
    private paymentService: PaymentService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getReceipts();
    this.paymentService.getPaymentModeDetails().subscribe((res) => {
      console.log(res.data);
      this.paymentMode = res.data;
      let roles = this.loginService.getCompanyRoles();
      if (roles?.includes('AUDITOR')) {
        this.IsAuditor = false;
      } else {
        this.IsAuditor = true;
      }
    });
  }

  getReceipts() {
    this.receiptService.getReceipts(this.companyId).subscribe((res) => {
      this.receipts = res.data;
    });
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = this.addZeroPadding(date.getMonth() + 1);
    const day = this.addZeroPadding(date.getDate());
    return `${year}-${month}-${day}`;
  }

  addZeroPadding(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedReceipts();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedReceipts();
    }
  }

  fetchLimitedReceipts() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.receiptService
      .getLimitedReceipts(
        offset,
        this.pageTotalItems,
        this.companyId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('receipts not found ');
          this.currentPageNumber -= 1;
        } else {
          this.receipts = res.data;
        }
      });
  }

  onSubmit() {
    this.receiptService
      .addReceipts({
        sn: 0,
        companyId: this.companyId,
        branchId: this.branchId,
        amount: Number(this.ReciptForm.value.amount!),
        date: new Date(this.ReciptForm.value.date!),
        modeId: Number(this.ReciptForm.value.paymentModeId),
        partyId: Number(this.ReciptForm.value.partyId),
        postDateCheck: Boolean(this.ReciptForm.value.postDateCheck),
        status: true,
        tdsDeductedAmount: Number(this.ReciptForm.value.Tds),
      })
      .subscribe({
        complete: () => {
          this.getReceipts();
        },
        next: (res) => {
          this.ReciptForm.reset();
        },
      });
  }

  deleteReceipt(sn: number) {
    this.receiptService.deleteReceipt(sn).subscribe({
      complete: () => {
        this.getReceipts();
      },
    });
  }
}
