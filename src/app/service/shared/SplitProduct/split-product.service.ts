import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { BASE_URL } from 'src/app/constants/urls';
import { SplitProduct } from 'src/app/models/SplitProduct';


@Injectable({
  providedIn: 'root'
})
export class SplitProductService {

  
  
  
  constructor(private http: HttpClient, private toastrService: ToastrService) { }
  getAllSplitProduct(companyId: number, branchId: number): Observable<any> {
    return this.http.get(`${BASE_URL}`+`/split/`+`${companyId}/${companyId}?companyid=${companyId}&branchid=${branchId}`);
  }


  addSplitProduct(splitProducts :SplitProduct): Observable<any> {
    return this.http.post(`${BASE_URL}`+`/split`, splitProducts).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('splitProducts Added Successfully');
          console.log(response)
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('splitProducts Adding Failed');
        },
      })
    );
  }
  getSplitProductById(productId:number): Observable<any> {
    console.log(`${BASE_URL}/split/id/${productId}`);
    return this.http.get(`${BASE_URL}`+`/split/id/${productId}`);
  }


  splitAgain(SplitProductObj: SplitProduct) {
    return this.http.put(`${BASE_URL}/split/splitAgain`, SplitProductObj);
  }
  
  Merge(SplitProductObj: SplitProduct) {
    return this.http.put(`${BASE_URL}/split/merge`, SplitProductObj);
  }

}