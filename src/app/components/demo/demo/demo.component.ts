import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Logo } from 'src/app/models/company-logo/CompanyImage';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent {
  imageData!: Logo;

  constructor(
    private router: Router,
    private CompanyService: CompanyServiceService,
    private LoginService: LoginService
  ) {}

  ngOnInit() {}

  gotoPayment() {
    this.router.navigateByUrl('/dashboard/payment');
  }
}
