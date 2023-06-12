import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { Bank } from 'src/app/models/Bank';
import { Loan } from 'src/app/models/Loan';
import { LoanNames } from 'src/app/models/LoanNames';
import { LoanTypes } from 'src/app/models/LoanTypes';
import { Unsub } from 'src/app/models/Unsub';
import { Company } from 'src/app/models/company';
import { LoanService } from 'src/app/service/loan.service';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css'],
})
export class LoanComponent {
  IsAuditor!: boolean;

  loans: Loan[] = [];
  createLoanEnable: boolean = false;
  updateLoanEnable: boolean = false;
  compId!: number;
  branchId!: number;

  loanForUpdateId!: number;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  constructor(
    private loanService: LoanService,
    private loginService: LoginService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.branchId = this.loginService.getBranchId();
    this.compId = this.loginService.getCompnayId();
    this.getAllLoans();
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }
  }

  getAllLoans() {
    this.loanService.getLoans(this.compId, this.branchId).subscribe((data) => {
      this.loans = data.data;
    });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedLoans();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedLoans();
    }
  }

  fetchLimitedLoans() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.loanService
      .getLimitedLoans(offset, this.pageTotalItems, this.compId, this.branchId)
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('loan infos not found ');
          this.currentPageNumber -= 1;
        } else {
          this.loans = res.data;
        }
      });
  }

  disableLoanComponent($event: boolean) {
    if ($event === true) {
      this.createLoanEnable = false;
      this.getAllLoans();
    }
  }

  disableEditComponent($event: boolean) {
    if ($event === true) {
      this.updateLoanEnable = false;
      this.getAllLoans();
    }
  }

  deleteLoan(id: number) {
    this.loanService
      .deleteLoan(id, this.compId, this.branchId)
      .subscribe((data) => {
        this.toastrService.success('loan has been deleted !');
        this.getAllLoans();
      });
  }

  loanForUpdate(id: number) {
    this.updateLoanEnable = true;
    this.loanForUpdateId = id;
  }

  enableLoanComponent() {
    this.createLoanEnable = true;
  }
}
