import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_ALL_WITHDRAW } from 'src/app/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class BankwithdrawService {

  constructor(private http :HttpClient) { }

  getAllwithdraw(companyId:number,branchId:number) :Observable<any>{
    return this.http.get(`${GET_ALL_WITHDRAW}/${companyId}/${branchId}`);
  }

}
