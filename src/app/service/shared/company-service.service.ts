import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { ADD_COMPANY_URL, COMPANY_URL } from 'src/app/constants/urls';

import { Company } from 'src/app/models/company';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class CompanyServiceService {
  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {}

  getCompnayDetails(): Observable<any> {
    console.log('get company hit');
    return this.httpClient.get(COMPANY_URL);
  }

  addCompany(company: Company): Observable<any> {
    console.log('hit the service');
    return this.httpClient.post(ADD_COMPANY_URL, company).pipe(
      tap({
        next: (respone) => {
          console.log(respone);
          this.toastrService.success('Company Added Successfully');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(err.error, 'Login Failed');
        },
      })
    );
  }

  // addcompany(company: Company) {
  //   return this.httpClient.post(ADD_COMPANY_URL, company);
  // }
}
