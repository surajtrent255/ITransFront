import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
  ASSIGN_COMPANY_TO_USER,
  GET_ALL_ROLES,
  GET_ALL_USER,
  GET_USERS_BY_COMPANYID,
  UPDATE_USER_COMPANY_STATUS,
  USER_CONFIGURATION_DETAILS,
  USER_ROLE_UPDATE,
  USER_UPDATE_STATUS_URL,
} from 'src/app/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class UserConfigurationService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getUserConfiguration(companyId: number): Observable<any> {
    return this.http.get(`${USER_CONFIGURATION_DETAILS}/${companyId}`);
  }

  getRoles(): Observable<any> {
    return this.http.get(GET_ALL_ROLES);
  }

  updateUserStatus(status: string, userId: number): Observable<any> {
    const userStatus = { status, userId };
    console.log(userStatus);
    return this.http.post(USER_UPDATE_STATUS_URL, userStatus).pipe(
      tap({
        next: (respone) => {
          console.log(respone);
          this.toastrService.success('Status Changed Successfully');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(err.error, 'Status Change Failed');
        },
      })
    );
  }

  updateUserCompanyStatus(status: string, userId: number): Observable<any> {
    return this.http
      .post(
        `${UPDATE_USER_COMPANY_STATUS}?status=${status}&userId=${userId}`,
        'success'
      )
      .pipe(
        tap({
          next: (respone) => {
            console.log(respone);
            this.toastrService.success('Status Changed Successfully');
          },
          error: (err) => {
            console.log(err);
            this.toastrService.error(err.error, 'Status Change Failed');
          },
        })
      );
  }

  updateUserRole(userId: number, roleId: number): Observable<any> {
    const userRoleStatus = { userId, roleId };
    console.log(userRoleStatus);
    return this.http.post(USER_ROLE_UPDATE, userRoleStatus).pipe(
      tap({
        next: (respone) => {
          console.log(respone);
          this.toastrService.success('Role Changed Successfully');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(err.error, 'Role Change Failed');
        },
      })
    );
  }

  getAllUser(): Observable<any> {
    return this.http.get(GET_ALL_USER);
  }

  getUsersByCompanyId(companyId: number): Observable<any> {
    return this.http.get(`${GET_USERS_BY_COMPANYID}?companyId=${companyId}`);
  }

  assignCompanyToUser(companyId: number, userId: number): Observable<any> {
    console.log('assign controller is hit');
    return this.http.get(
      `${ASSIGN_COMPANY_TO_USER}?companyId=${companyId}&userId=${userId}`
    );
  }
}
