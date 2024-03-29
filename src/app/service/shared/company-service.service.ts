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
import { Logo } from 'src/app/models/company-logo/CompanyImage';
import { RJResponse } from 'src/app/models/rjresponse';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class CompanyServiceService {
  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {}

  getCompnayDetails(user_id: number): Observable<any> {
    return this.httpClient.get(`${USER_COMPANY_URL}/${user_id}`);
  }

  // updateUserCompany(comapanyId: number, userId: number): Observable<any> {
  //   const body = { comapanyId, userId };
  //   return this.httpClient.post(UPDATE_USER_COMPANY_URL, body);
  // }

  addCompany(companyDTO: Company, userId: number): Observable<any> {
    const body = { companyDTO: companyDTO, userId: userId };
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

  // company Logo

  getCompanyLogo(companyId: number): Observable<RJResponse<Logo>> {
    return this.httpClient.get<RJResponse<Logo>>(
      `${COMPANY_BASE_URL}/image?companyId=${companyId}`
    );
  }

  addCompanyLogo(file: File, companyId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', String(companyId));
    return this.httpClient
      .post(`${COMPANY_BASE_URL}/logo/upload`, formData)
      .pipe(
        tap({
          next: (respone) => {
            this.toastrService.success('Logo Successfully Addded');
          },
          error: (err) => {
            console.log(err);
            this.toastrService.error('Something Went Wrong');
          },
        })
      );
  }

  editCompany(comapanyDTO: Company): Observable<any> {
    return this.httpClient.put(`${COMPANY_BASE_URL}/edit`, comapanyDTO);
  }
}
