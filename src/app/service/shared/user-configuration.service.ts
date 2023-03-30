import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
  USER_CONFIGURATION_DETAILS,
  USER_UPDATE_STATUS_URL,
} from 'src/app/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class UserConfigurationService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getUserConfiguration(): Observable<any> {
    return this.http.get(USER_CONFIGURATION_DETAILS);
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
}
