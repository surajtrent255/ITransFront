import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable ,tap } from 'rxjs';
import { GET_ALL_WITHDRAW } from 'src/app/constants/urls';
import { BankWidthdraw } from 'src/app/models/Bankwithdraw';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class BankwithdrawService {

  constructor(private http :HttpClient
    ,private toastrService:ToastrService,
   
    ) { }

  getAllwithdraw(companyId:number,branchId:number) :Observable<any>{
    return this.http.get(`${GET_ALL_WITHDRAW}/${companyId}/${branchId}?companyId=${companyId}&branchId=${branchId}`);
  }
  addWithdraw(withdraw: BankWidthdraw): Observable<any> {
    console.log("service"+withdraw);
    return this.http.post(`${GET_ALL_WITHDRAW}`, withdraw).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('withdraw Added Successfully');
          console.log(response)
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('withdraw Adding Failed');
        },
      })
    );
}
deletewithdraw(branchId: number,withdrawId:number){
  let url = `${GET_ALL_WITHDRAW}/${branchId}/${withdrawId}`;
  return this.http.delete(url);
}

}
