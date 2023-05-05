import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Expense } from 'src/app/models/Expense/Expense';
import { ExpenseService } from 'src/app/service/shared/Assets And Expenses/expense.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent {
  // for Display
  expense: Expense[] = [];
  expenseIdForEdit!: number;

  LoggedInCompanyId!: number;
  LoggedInBranchId!: number;

  IsAuditor!: boolean;

  ExpenseForm = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    topic: new FormControl('', [Validators.required]),
    billNo: new FormControl('', [Validators.required]),
    payTo: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  constructor(
    private expenseService: ExpenseService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.LoggedInBranchId = this.loginService.getBranchId();
    this.LoggedInCompanyId = this.loginService.getCompnayId();
    this.getExpenseDetails();
    let roles = localStorage.getItem('CompanyRoles');
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }
  }

  getExpenseDetails() {
    this.expenseService
      .getExpenseDetails(this.LoggedInCompanyId)
      .subscribe((res) => {
        this.expense = res.data;
      });
  }

  SubmitExpenseForm() {
    this.expenseService
      .addExpenseDetails({
        sn: 0,
        companyId: this.LoggedInCompanyId,
        branchId: this.LoggedInBranchId,
        amount: Number(this.ExpenseForm.value.amount!),
        billNo: Number(this.ExpenseForm.value.billNo!),
        date: this.ExpenseForm.value.date!,
        payTo: this.ExpenseForm.value.payTo!,
        status: true,
        topic: this.ExpenseForm.value.topic!,
      })
      .subscribe({
        complete: () => {
          this.getExpenseDetails();
        },
        next: () => {
          this.ExpenseForm.reset();
        },
      });
  }

  deleteExpenseDetails(SN: number) {
    this.expenseService.deleteExpenseDetails(SN).subscribe({
      complete: () => {
        this.getExpenseDetails();
      },
    });
  }

  editExpense(sn: number) {
    this.expenseIdForEdit = sn;
  }

  getAllExpenseDetails() {
    this.getExpenseDetails();
  }
}
