import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/models/Bank';
import { BankWidthdraw } from 'src/app/models/Bankwithdraw';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { BankwithdrawService } from 'src/app/service/shared/bankwithdraw/bankwithdraw.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-bank-withdraw',
  templateUrl: './bank-withdraw.component.html',
  styleUrls: ['./bank-withdraw.component.css']
})

export class BankWithdrawComponent {
  withdrawId!: number;
  bankId!: number;
  companyId!: number;
  branchId!: number;
  banks: Bank[] = [];
  showForm!: boolean;
  withdraw: BankWidthdraw[] = [];
  objwidthdraw: BankWidthdraw = new BankWidthdraw;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  constructor(
    private loginService: LoginService,
    private bankService: BankService,
    private toastrService: ToastrService,
    private BankwithdrawService: BankwithdrawService
  ) { }

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    console.log(`${this.companyId}` + `${this.branchId}`)
    this.getAllBankWithdraw();

  }
  fetchRelatedBanks() {
    this.bankService.getAllBanks(this.companyId, this.branchId).subscribe((data) => {
      this.banks = data.data
    })
  }
  getAllBankWithdraw() {
    this.BankwithdrawService.getAllwithdraw(this.companyId, this.branchId).subscribe(res => {
      console.log(res.data)
      this.withdraw = res.data;
    });
  }

  changePage(type: string) {
    if (type === "prev") {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedWithdraws();
    } else if (type === "next") {
      this.currentPageNumber += 1;
      this.fetchLimitedWithdraws();
    }
  }


  fetchLimitedWithdraws() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.BankwithdrawService.getLimitedWithdraw(offset, this.pageTotalItems, this.companyId, this.branchId).subscribe((res) => {
      if (res.data.length === 0) {
        this.toastrService.error("withdraw not found ")
        this.currentPageNumber -= 1;
      } else {
        this.withdraw = res.data;

      }
    })
  }

  openForm() {
    this.resetForm();
    this.fetchRelatedBanks();
    console.log('Opening form...');
    // Reset form data
    this.companyId = this.companyId;
    this.branchId = this.branchId;
    this.showForm = true;

    // Show form

    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'block';
    }
  }
  creatwithdraw(form: any) {
    this.showForm = false;
    this.objwidthdraw.companyId = this.loginService.getCompnayId();
    this.objwidthdraw.branchId = this.loginService.getBranchId();
    this.objwidthdraw.withdrawDate = new Date();
    console.log(this.objwidthdraw);
    this.BankwithdrawService.addWithdraw(this.objwidthdraw).subscribe({
      next: (data) => {
        this.toastrService.success("widthdraw added sucessfull" + data.widthdrawId);
        this.getAllBankWithdraw();

      }, error: (err) => {
        this.toastrService.error("something wrong");
      }
    })
    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {

      bankForm.style.display = 'none';
      this.resetForm();
    }
  }
  cancel_btn() {
    this.resetForm();
    this.showForm = false;
    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }
  deletewithdraw(branchId: number, withdrawId: number) {

    this.BankwithdrawService.deletewithdraw(branchId, withdrawId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success("deposite has been deleted" + withdrawId)
        this.getAllBankWithdraw();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.getAllBankWithdraw();
      },
    });
  }
  resetForm() {
    this.objwidthdraw = new BankWidthdraw();
  }


}
