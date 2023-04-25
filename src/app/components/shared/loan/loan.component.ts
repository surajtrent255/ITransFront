import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { Loan } from "src/app/models/Loan"
import { LoanNames } from 'src/app/models/LoanNames';
import { LoanTypes } from 'src/app/models/LoanTypes';
import { Unsub } from 'src/app/models/Unsub';
import { Company } from 'src/app/models/company';
import { LoanService } from 'src/app/service/loan.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']

})

export class LoanComponent extends Unsub {
  banks: Bank[] = [new Bank(1, "bank1"), new Bank(2, "bank2")]
  loan: Loan = new Loan;


  loanTypes: LoanTypes[] = [];
  loanNames: LoanNames[] = [];
  lenders: Company[] = [];
  lenderSearchMethod: number = 1;

  compId !: number;
  branchId !: number;
  lenderPanOrPhone !: number;
  selectCompanyActive: boolean = true;

  constructor(private loanService: LoanService,
    private loginService: LoginService,
    private companyService: CompanyServiceService,
    private toastrService: ToastrService) {
    super();

  }

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchLoanTypes();
    this.fetchLoanNames();
  }

  fetchLoanTypes() {
    this.loanService.getAllLoanTypes().subscribe((data) => {
      this.loanTypes = data.data
    })
  }

  fetchLoanNames() {
    this.loanService.getAllLoanNames().subscribe((data) => {
      this.loanNames = data.data
    })
  }

  lenderSearch(id: number) {
    this.lenderSearchMethod = id;
  }
  fetchLenderInfo() {
    // this.selectCompanyActive = true;
    if (this.lenderPanOrPhone === null || this.lenderPanOrPhone === undefined) {
      this.toastrService.error(
        `pan or phone`,
        'invalid number'
      );
      return;
      // return;
    }

    this.companyService.getCustomerInfoByPanOrPhone(this.lenderSearchMethod, this.lenderPanOrPhone).subscribe(({
      next: (data) => {
        this.lenders = data.data;
        // this.selectMenusForCompanies = data.data;
        // this.selectMenusForCompaniesSize = data.data.length;
      },
      complete: () => {
        const lenderBtn = document.getElementById("selectLender") as HTMLButtonElement;
        lenderBtn.click();
      }
    }));
  }

  createLoan(form: any) {
    this.loan.companyId = this.compId;
    this.loan.branchId = this.branchId;
    this.loanService.createLoan(this.loan).subscribe(
      {
        next: (data) => {
          this.toastrService.success("Loan successfully created ! id:" + data.data)
        },
        error: (error) => {
          this.toastrService.error(" something went wrong ")
        },
        complete: () => {
          form.reset();
        }
      })

  }

  setLenderId(id: number) {
    this.loan.lenderId = id;
    this.selectCompanyActive = false;

    setTimeout(() => {
      this.selectCompanyActive = true;
    })
  }
}


class Bank {


  constructor(public id: number = 0, public name: String = '') {

  }
}
