import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_ALL_USERS_FOR_SUPER_ADMIN_LISTING } from 'src/app/constants/urls';
import { RJResponse } from 'src/app/models/rjresponse';
import { UserConfiguration } from 'src/app/models/user-configuration';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  constructor(private http: HttpClient) {}

  getAllUsersForSuperAdminListing(): Observable<
    RJResponse<UserConfiguration[]>
  > {
    return this.http.get<RJResponse<UserConfiguration[]>>(
      GET_ALL_USERS_FOR_SUPER_ADMIN_LISTING
    );
  }

  assignAdminRoleBySuperAdmin(userId: number): Observable<any> {
    return this.http.put(
      `${GET_ALL_USERS_FOR_SUPER_ADMIN_LISTING}/assign?userId=${userId}`,
      ''
    );
  }

  updateUserStatusFromSuperAdmin(
    status: boolean,
    userId: number
  ): Observable<any> {
    return this.http.put(
      `${GET_ALL_USERS_FOR_SUPER_ADMIN_LISTING}?status=${status}&userId=${userId}`,
      ''
    );
  }
}
