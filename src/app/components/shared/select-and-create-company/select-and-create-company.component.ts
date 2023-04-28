import { JsonPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { BranchService } from 'src/app/service/shared/branch.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { RoleService } from 'src/app/service/shared/role.service';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';
import $ from 'jquery';
import { Roles } from 'src/app/models/Roles';

@Component({
  selector: 'app-select-and-create-company',
  templateUrl: './select-and-create-company.component.html',
  styleUrls: [
    './select-and-create-company.component.css',
    '../../../../assets/resources/css/styles.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SelectAndCreateCompanyComponent {
  IsAdmin!: boolean;
  user_id!: number;
  company!: Company[];
  role!: Roles[];

  constructor(
    private companyService: CompanyServiceService,
    private loginService: LoginService,
    private router: Router,
    private branchService: BranchService
  ) {}

  ngOnInit() {
    this.loginService.userObservable.subscribe((LogggedInUser) => {
      this.user_id = LogggedInUser.user.id;
      this.IsAdmin = LogggedInUser.user.roles.some(
        (role) => role.role === 'ADMIN'
      );
      console.log(this.IsAdmin);
    });
    this.getCompanyDetails();
  }

  getCompanyDetails() {
    this.companyService.getCompnayDetails(this.user_id).subscribe((res) => {
      this.company = res.data;
    });
  }

  proceed(company: any) {
    localStorage.setItem('companyDetails', JSON.stringify(company));
    this.branchService
      .getBranchDetailsByCompanyAndUserId(company.companyId, this.user_id)
      .subscribe((res) => {
        if (res.data) {
          localStorage.setItem('BranchDetails', JSON.stringify(res.data));
        }
        if (!res.data || Object.keys(res.data).length === 0) {
          let branchStatus = [{ branchId: 0 }];
          localStorage.setItem('BranchDetails', JSON.stringify(branchStatus));
        }
        this.router.navigateByUrl('/dashboard/demo');
      });
  }
  getAllCompanyDetails() {
    this.getCompanyDetails();
  }
}
