import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
  ADD_COMPANY_URL,
  COMPANY_BASE_URL,
  USER_COMPANY_URL,
} from 'src/app/constants/urls';

import { Company } from 'src/app/models/company';
import { RJResponse } from 'src/app/models/rjresponse';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class CompanyServiceService {
  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) { }

  getCompnayDetails(user_id: number): Observable<any> {
    return this.httpClient.get(`${USER_COMPANY_URL}/${user_id}`);
  }

  // updateUserCompany(comapanyId: number, userId: number): Observable<any> {
  //   const body = { comapanyId, userId };
  //   return this.httpClient.post(UPDATE_USER_COMPANY_URL, body);
  // }

  addCompany(companyDTO: Company, userId: number): Observable<any> {
    const body = { companyDTO, userId };
    console.log('hit the service');
    console.log(body);
    return this.httpClient.post(ADD_COMPANY_URL, body).pipe(
      tap({
        next: (respone) => {
          console.log(respone);
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(err.error, 'Login Failed');
        },
      })
    );
  }

  getAllCompanies(): Observable<RJResponse<Company[]>> {
    return this.httpClient.get<RJResponse<Company[]>>(COMPANY_BASE_URL);
  }

  // addcompany(company: Company) {
  //   return this.httpClient.post(ADD_COMPANY_URL, company);
  // }

  getCustomerInfoByPanOrPhone(
    searchMethod: number,
    customerPhoneOrPan: number
  ): Observable<RJResponse<Company[]>> {
    let url = `${COMPANY_BASE_URL}/searchBy?searchMethod=${searchMethod}&customerPhoneOrPan=${customerPhoneOrPan}`;
    console.log(url);
    return this.httpClient.get<RJResponse<Company[]>>(url);
  }
}
