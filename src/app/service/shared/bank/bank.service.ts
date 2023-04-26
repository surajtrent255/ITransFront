import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { GET_ALL_BANK, post_ALL_BANK } from 'src/app/constants/urls';
import { Bank } from 'src/app/models/Bank';

@Injectable({
  providedIn: 'root'
})
export class BankService {
 

  constructor(private http :HttpClient,private toastrService:ToastrService) { }

  getAllBanks(companyId:number,branchId:number) :Observable<any>{
    return this.http.get(`${GET_ALL_BANK}?companyid=${companyId}&branchid=${branchId}`);
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
}
  


