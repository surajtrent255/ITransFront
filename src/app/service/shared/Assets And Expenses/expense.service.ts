import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { GET_EXPENSE_DETAILS } from 'src/app/constants/urls';
import { Expense } from 'src/app/models/Expense/Expense';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient, private toastrService: ToastrService) { }

  getExpenseDetails(companyId: number): Observable<RJResponse<Expense[]>> {
    return this.http.get<RJResponse<Expense[]>>(
      `${GET_EXPENSE_DETAILS}?companyId=${companyId}`
    );
  }

  getLimitedExpenseDetail(offset: number, pageTotalItems: number, compId: number, branchId: number): Observable<RJResponse<Expense[]>> {
    let url = `${GET_EXPENSE_DETAILS}/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Expense[]>>(url);
  }


  getExpenseBySN(sn: number): Observable<any> {
    return this.http.get(`${GET_EXPENSE_DETAILS}/${sn}`);
  }

  updateExpenseDetails(expense: Expense): Observable<any> {
    return this.http.put(GET_EXPENSE_DETAILS, expense).pipe(
      tap({
        next: (res) => {
          this.toastrService.success('Update SuccessFul');
        },
        error: (err) => {
          this.toastrService.error(err);
        },
      })
    );
  }

  addExpenseDetails(expense: Expense): Observable<any> {
    return this.http.post(GET_EXPENSE_DETAILS, expense).pipe(
      tap({
        next: (response) => {
          this.toastrService.success(response.toString());
        },
        error: (err) => {
          this.toastrService.error('Something Went Worng' + err);
        },
      })
    );
  }

  deleteExpenseDetails(SN: number) {
    return this.http.delete(`${GET_EXPENSE_DETAILS}/${SN}`);
  }
}
