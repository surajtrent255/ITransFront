import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { USER_LOGIN_URL, USER_REGISTER_URL } from 'src/app/constants/urls';
import { UserLogin } from 'src/app/interfaces/user-login';
import { RJResponse } from 'src/app/models/rjresponse';
import { ToastrService } from 'ngx-toastr';

import { User } from 'src/app/models/user';
import { IUserRegistration } from 'src/app/interfaces/iuser-registration';
import { Company } from 'src/app/models/company';

const USER_KEY = 'User';
const USER_TOKEN = 'UserToken';
const COMPANY_KEY = 'Company';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );

  private companySubject = new BehaviorSubject<Company>(
    this.getCompanyFromLocalStorage()
  );
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  public get CurrentCompnay(): Company {
    return this.companySubject.value;
  }
  // rought
  getCompnayId(): number {
    var compnay: any = JSON.parse(localStorage.getItem('companyDetails')!);
    console.log(compnay);
    console.log('creating product !!! ');
    return compnay.companyId;
  }

  login(userLogin: UserLogin): Observable<RJResponse<User>> {
    return this.http.post<RJResponse<User>>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (response) => {
          this.setUserToLocalStorage(response.data);
          this.setUserTokenToLocalStorage(response.data.token);
          this.userSubject.next(response.data);
          this.toastrService.success(
            `Welcome to Iaccounting ${response.data.user.firstname}!`,
            'Login Successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        },
      })
    );
  }

  register(registerData: IUserRegistration): Observable<RJResponse<User>> {
    return this.http
      .post<RJResponse<User>>(USER_REGISTER_URL, registerData)
      .pipe(
        tap({
          next: (response) => {
            this.toastrService.success(
              `User Successfully Added`,
              `Register Successful`
            );
          },
          error: (err) => {
            this.toastrService.error(err.error, 'Registration Failed');
          },
        })
      );
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private setUserTokenToLocalStorage(token: string) {
    localStorage.setItem(USER_TOKEN, JSON.stringify(token));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) return JSON.parse(userJson) as User;
    return new User();
  }

  getCompanyFromLocalStorage() {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(1));
    const companyJson = localStorage.getItem(COMPANY_KEY);
    if (companyJson) return JSON.parse(companyJson) as Company;
    return new Company();
  }
}
