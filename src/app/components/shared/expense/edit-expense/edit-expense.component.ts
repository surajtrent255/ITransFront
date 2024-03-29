import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Expense } from 'src/app/models/Expense/Expense';
import { ExpenseService } from 'src/app/service/shared/Assets And Expenses/expense.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.css'],
})
export class EditExpenseComponent {
  @Input() ExpenseId!: number;
  @Output() updatedSuccessful = new EventEmitter<boolean>(false);
  expense: Expense = new Expense();
  newDate!: Date;

  constructor(
    private expenseService: ExpenseService,
    private commonService: CommonService,
    private elementRef: ElementRef
  ) {}

  ngOnChanges() {
    this.getExpenseDetailsBySN(this.ExpenseId);
  }

  getExpenseDetailsBySN(sn: number) {
    this.expenseService.getExpenseBySN(sn).subscribe((res) => {
      this.expense = res.data;
      let date = this.commonService.formatDate(Number(this.expense.date));
      this.expense.date = date;
    });
  }

  updateExpense() {
    this.expenseService.updateExpenseDetails(this.expense).subscribe({
      next: (res) => {
        this.updatedSuccessful.emit(true);
      },
    });
  }
}
