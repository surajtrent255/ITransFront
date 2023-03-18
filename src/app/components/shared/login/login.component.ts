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
  loginUser() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    this.loginService
      .login({
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      })
      .subscribe(() => {
        this.router.navigateByUrl('dashboard');
      });
  }
}
