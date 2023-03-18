import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css',
    '../../../../assets/resources/css/styles.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
  isSubmitted = false;

  RegisterForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {}

  get firstname() {
    return this.RegisterForm.get('firstname');
  }

  get lastname() {
    return this.RegisterForm.get('lastname');
  }
  get email() {
    return this.RegisterForm.get('email');
  }
  get password() {
    return this.RegisterForm.get('password');
  }
  registerUser() {
    this.isSubmitted = true;

    if (this.RegisterForm.invalid) return;

    this.loginService
      .register({
        firstname: this.RegisterForm.value.firstname!,
        lastname: this.RegisterForm.value.lastname!,
        email: this.RegisterForm.value.email!,
        password: this.RegisterForm.value.password!,
      })
      .subscribe(() => {
        this.router.navigateByUrl('login');
      });
  }
}
