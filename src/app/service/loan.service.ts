import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RJResponse } from '../models/rjresponse';
import { LoanTypes } from '../models/LoanTypes';
import { BASE_URL } from '../constants/urls';
import { LoanNames } from '../models/LoanNames';
import { Loan } from '../models/Loan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private http: HttpClient) { }


  getAllLoanTypes(): Observable<RJResponse<LoanTypes[]>> {
    let url = `${BASE_URL}/loan/types`;
    return this.http.get<RJResponse<LoanTypes[]>>(url);
  }

  getAllLoanNames(): Observable<RJResponse<LoanNames[]>> {
    let url = `${BASE_URL}/loan/names`;
    return this.http.get<RJResponse<LoanNames[]>>(url);
  }

  createLoan(loan: Loan): Observable<RJResponse<Number>> {
    let url = `${BASE_URL}/loan`;
    return this.http.post<RJResponse<Number>>(url, loan)
  }

}
