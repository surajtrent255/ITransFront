import { Component, EventEmitter, Output } from '@angular/core';
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
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.css']
})
export class CreateLoanComponent {


  @Output() destroyCreateLoanComp = new EventEmitter<boolean>(false);
  banks: Bank[] = [];
  loan: Loan = new Loan;


  loanTypes: LoanTypes[] = [];
  loanNames: LoanNames[] = [];
  lenders: Company[] = [];
  lenderSearchMethod: number = 1;

  compId !: number;
  branchId !: number;
  lenderPanOrPhone !: number;
  selectCompanyActive: boolean = false;
  customerMetaData !: CustomerMetaData;


  constructor(private loanService: LoanService,
    private loginService: LoginService,
    private companyService: CompanyServiceService,
    private bankService: BankService,
    private toastrService: ToastrService) {

  }

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchLoanTypes();
    this.fetchLoanNames();
    this.fetchRelatedBanks();
  }

  fetchRelatedBanks() {
    this.bankService.getAllBanks(this.compId, this.branchId).subscribe((data) => {
      this.banks = data.data
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
    if (this.lenderPanOrPhone === null || this.lenderPanOrPhone === undefined) {
      this.toastrService.error(
        `pan or phone`,
        'invalid number'
      );
      return;
      // return;
    }
    setTimeout(() => {
      this.selectCompanyActive = true;

    }, 300)
    this.companyService.getCustomerInfoByPanOrPhone(this.lenderSearchMethod, this.lenderPanOrPhone).subscribe(({
      next: (data) => {
        this.lenders = data.data;
        this.customerMetaData.customers = this.lenders;
        this.customerMetaData.customerPanOrPhone = this.lenderPanOrPhone;
        // this.selectMenusForCompanies = data.data;
        // this.selectMenusForCompaniesSize = data.data.length;
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
          this.destroyComp();
        }
      })

  }

  setLenderId(id: number) {
    this.loan.lenderId = id;
    this.destroySelectLenderComponent(true);
  }

  destroyComp() {
    const closeCreateLoanEl = document.getElementById("closeCreateLoan") as HTMLAnchorElement;
    closeCreateLoanEl.click();
    this.destroyCreateLoanComp.emit(true);
  }

  destroySelectLenderComponent($event) {
    if ($event) {
      this.selectCompanyActive = false;
    }
  }

}
