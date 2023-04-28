import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { GET_ALL_DEPOSITE,  post_ALL_DEPOSITE } from 'src/app/constants/urls';
import { Deposit } from 'src/app/models/BankDeposite';


@Injectable({
  providedIn: 'root'
})
export class BankdepositeService {

  constructor(private http :HttpClient ,private toastrService:ToastrService) { }

  getAlldeposite(companyId:number,branchId:number) :Observable<any>{
    return this.http.get(`${GET_ALL_DEPOSITE}companyId=${companyId}&branchId=${branchId}`);
  }


  addDeposite(deposit: Deposit): Observable<any> {
    console.log("service"+deposit);
    return this.http.post(post_ALL_DEPOSITE, deposit).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('deposite Added Successfully');
          console.log(response)
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('deposite Adding Failed');
        },
      })
    );
}







}
