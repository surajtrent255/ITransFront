import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/models/Bank';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { Loan } from 'src/app/models/Loan';
import { LoanNames } from 'src/app/models/LoanNames';
import { LoanTypes } from 'src/app/models/LoanTypes';
import { Company } from 'src/app/models/company';
import { LoanService } from 'src/app/service/loan.service';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-loan',
  templateUrl: './edit-loan.component.html',
  styleUrls: ['./edit-loan.component.css']
})
export class EditLoanComponent {

  @Input() loanId !: number;
  @Output() destroyEditLoanComp = new EventEmitter<boolean>(false);

  banks: Bank[] = [];
  loan: Loan = new Loan;
  compId !: number;
  branchId !: number;

  loanTypes: LoanTypes[] = [];
  loanNames: LoanNames[] = [];
  lenders: Company[] = [];
  lenderSearchMethod: number = 1;

  lenderPanOrPhone !: number;
  selectCompanyActive: boolean = true;
  customerMetaData !: CustomerMetaData;

  constructor(
    private loginService: LoginService,
    private bankService: BankService,
    private loanService: LoanService,
    private companyService: CompanyServiceService,
    private toastrService: ToastrService
  ) {
    this.loanId
  }

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchLoanTypes();
    this.fetchLoanNames();
    this.fetchRelatedBanks();
    this.fetchSingleLoan(this.loanId);

  }

  fetchRelatedBanks() {
    this.bankService.getAllBanks(this.compId, this.branchId).subscribe((data) => {
      this.banks = data.data
    })
  }

  fetchSingleLoan(loanId: number) {
    this.loanService.getSingleLoan(loanId, this.compId, this.branchId).subscribe((data) => {
      this.loan = data.data
    })
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
        this.customerMetaData.customerPanOrPhone = this.lenderPanOrPhone;
        this.customerMetaData.customers = this.lenders;
        let customerMetaData = new CustomerMetaData;
        customerMetaData.customers = data.data;
        customerMetaData.customerPanOrPhone = this.lenderPanOrPhone;
        this.customerMetaData = customerMetaData;
      },
      complete: () => {
        const lenderBtn = document.getElementById("selectLender") as HTMLButtonElement;
        lenderBtn.click();
      }
    }));
  }

  editLoan(form: any) {
    this.loanService.editLoan(this.loan.id, this.compId, this.branchId, this.loan).subscribe((data) => {
      this.toastrService.success("loan successfully updated");
    })
  }

  destroyComp() {
    this.destroyEditLoanComp.emit(true);
  }

  setLenderId(id: number) {
    this.loan.lenderId = id;
    this.selectCompanyActive = false;

    setTimeout(() => {
      this.selectCompanyActive = true;
    })
  }


}
