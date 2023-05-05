import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../../assets/resources/css/styles.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  isSubmitted = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  RegisterForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl(''),
    registerEmail: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.minLength(10)]),
    registerPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get registerEmail() {
    return this.RegisterForm.get('registerEmail');
  }

  get registerPassword() {
    return this.RegisterForm.get('registerPassword');
  }

  get firstname() {
    return this.RegisterForm.get('firstname');
  }

  get lastname() {
    return this.RegisterForm.get('lastname');
  }

  get phone() {
    return this.RegisterForm.get('phone');
  }

  loginUser() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    this.loginService
      .login({
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.loginService.userObservable.subscribe((user) => {
            user.user.roles.forEach((role) => {
              let data = role.role.includes('SUPER_ADMIN');
              if (data === true) {
                this.router.navigateByUrl('superAdmin');
              } else {
                this.router.navigateByUrl('company');
              }
            });
          });
        },
      });
  }

  registerUser() {
    this.isSubmitted = true;

    if (this.RegisterForm.invalid) return;

    this.loginService
      .register({
        firstname: this.RegisterForm.value.firstname!,
        lastname: this.RegisterForm.value.lastname!,
        email: this.RegisterForm.value.registerEmail!,
        phone: this.RegisterForm.value.phone!,
        password: this.RegisterForm.value.registerPassword!,
      })
      .subscribe(() => {
        window.location.reload();
      });
  }
}
