import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { BASE_URL, GET_ALL_BANK, post_ALL_BANK } from 'src/app/constants/urls';
import { AccountType } from 'src/app/models/AccountTypes';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  httpClient: any;


  constructor(private http: HttpClient, private toastrService: ToastrService) { }


  getAllBanks(companyId: number, branchId: number): Observable<any> {
    return this.http.get(`${GET_ALL_BANK}?companyid=${companyId}&branchid=${branchId}`);
  }

  getLimitedBank(offset: number, pageTotalItems: number, compId: number, branchId: number): Observable<RJResponse<Bank[]>> {
    let url = `${BASE_URL}/api/v1/bank/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Bank[]>>(url);
  }

  getBankList(): Observable<RJResponse<BankList[]>> {
    let url = `${BASE_URL}/api/v1/bank/list`;
    return this.http.get<RJResponse<BankList[]>>(url);
  }




  getAccountTypes(): Observable<RJResponse<AccountType[]>> {
    let url = `${BASE_URL}/api/v1/bank/accounttype`;
    return this.http.get<RJResponse<AccountType[]>>(url)
  }
  addBank(bank: Bank): Observable<any> {
    return this.http.post(post_ALL_BANK, bank).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('Bank Added Successfully');
          console.log(response)
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('Bank Adding Failed');
        },
      })
    );
  }

  deletebank(bankId: number) {
    let url = `${BASE_URL}/api/v1/bank/${bankId}`;
    return this.http.delete(url);
  }

}



