import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountType } from 'src/app/models/AccountTypes';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
import { Branch } from 'src/app/models/Branch';
import { User } from 'src/app/models/user';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.css'],
})
export class CreateBankComponent {
  companyId!: number;
  branchId!: number;
  bankName!: string;
  accountNumber!: string;
  initialAmount!: string;
  accountType!: string;

  showInput!: boolean;

  Bank: Bank[] = [];
  accountTypes: AccountType[] = [];
  showForm!: boolean;
  localStorageCompanyId!: number;
  UserbranchId!: number;

  bankList: BankList[] = [];

  bankObj: Bank = new Bank();

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  constructor(
    private bankService: BankService,
    private toastrService: ToastrService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.localStorageCompanyId = this.loginService.getCompnayId();

    this.UserbranchId = this.loginService.getBranchId();
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getAllBank();
    this.getBankList();
    this.getAllAccountTypes();
  }

  getBankList() {
    this.bankService.getBankList().subscribe((data) => {
      this.bankList = data.data;
    });
  }

  getAllBank() {
    this.bankService
      .getAllBanks(this.companyId, this.branchId)
      .subscribe((res) => {
        console.log(res.data);
        this.Bank = res.data;
      });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedBanks();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedBanks();
    }
  }

  fetchLimitedBanks() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.bankService
      .getLimitedBank(
        offset,
        this.pageTotalItems,
        this.companyId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('banks not found ');
          this.currentPageNumber -= 1;
        } else {
          this.Bank = res.data;
        }
      });
  }
  getAllBankNames() {}

  getAllAccountTypes() {
    this.bankService.getAccountTypes().subscribe((data) => {
      this.accountTypes = data.data;
    });
  }

  openForm() {
    console.log('Opening form...');
    this.resetForm();
    // Reset form data
    this.companyId = this.localStorageCompanyId;
    this.branchId = this.UserbranchId;
    // this.bankName = '';
    // this.accountNumber = '';
    // this.initialAmount = '';
    // this.accountType = '';
    this.showForm = true;

    // Show form

    const bankForm = document.getElementById('bankForm');
    if (bankForm) {
      bankForm.style.display = 'block';
      this.showForm = false;
    }
  }

  SelecetBankChange(bankName: string) {
    if (bankName === 'other') {
      console.log('other');
      this.showInput = true;
    } else {
      console.log(bankName);
      this.showInput = false;
    }
  }

  createBank(form: any) {
    this.showForm = true;
    this.bankObj.companyId = this.companyId;
    this.bankObj.branchId = this.branchId;
    this.bankService.addBank(this.bankObj).subscribe({
      next: (data) => {
        this.toastrService.success(
          'bank is successfully added with id ' + data.data
        );
        this.getAllBank();
      },
      error: (err) => {
        this.toastrService.error('something went wrong');
      },
    });

    // Hide form
    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }
  cancel_btn() {
    this.showForm = false;
    const bankForm = document.getElementById('createNewCategoryPopup');

    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }

  deleteBank(bankId: number) {
    this.bankService.deletebank(bankId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success('bank has been deleted');
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.getAllBank();
      },
    });
  }
  resetForm() {
    this.bankObj = new Bank();
  }
}
