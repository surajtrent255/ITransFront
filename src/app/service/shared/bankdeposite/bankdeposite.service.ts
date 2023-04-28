import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_ALL_deposite } from 'src/app/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class BankdepositeService {

  constructor(private http :HttpClient) { }

  getAlldeposite(companyId:number,branchId:number) :Observable<any>{
    return this.http.get(`${GET_ALL_deposite}?companyId=${companyId}&branchId=${branchId}`);
  }








}
