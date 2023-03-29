import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_CONFIGURATION_DETAILS } from 'src/app/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class UserConfigurationService {
  constructor(private http: HttpClient) {}

  getUserConfiguration(): Observable<any> {
    return this.http.get(USER_CONFIGURATION_DETAILS);
  }
}
