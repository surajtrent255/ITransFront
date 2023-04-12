import { JsonPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SavedUserData } from 'src/app/models/SavedUserData';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

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
  user!: User;
  user_id!: number;
  company!: Company[];

  CompanyRegistrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    panNo: new FormControl(''),
    state: new FormControl('', [Validators.required]),
    zone: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    munVdc: new FormControl('', [Validators.required]),
    wardNo: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
  });

  constructor(
    private companyService: CompanyServiceService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginService.userObservable.subscribe((LogggedInUser) => {
      this.user_id = LogggedInUser.user.id;
    });
    this.companyService.getCompnayDetails(this.user_id).subscribe((res) => {
      console.log(`this is from component ${this.user_id}`);
      console.log(res.data);
      this.company = res.data;
      localStorage.setItem('companyDetails', JSON.stringify(res.data));
    });
  }

  get name() {
    return this.CompanyRegistrationForm.get('name');
  }

  get description() {
    return this.CompanyRegistrationForm.get('description');
  }

  get panNo() {
    return this.CompanyRegistrationForm.get('panNo');
  }

  get state() {
    return this.CompanyRegistrationForm.get('state');
  }

  get zone() {
    return this.CompanyRegistrationForm.get('zone');
  }

  get district() {
    return this.CompanyRegistrationForm.get('district');
  }

  get munVdc() {
    return this.CompanyRegistrationForm.get('munVdc');
  }

  get wardNo() {
    return this.CompanyRegistrationForm.get('wardNo');
  }

  get phone() {
    return this.CompanyRegistrationForm.get('phone');
  }

  registerCompany() {
    this.loginService.userObservable.subscribe((loginUser) => {
      this.user = loginUser;
      this.user_id = loginUser.user.id;
      console.log(this.user.user.id);
    });
    this.companyService
      .addCompany(
        {
          id: 0,
          name: this.CompanyRegistrationForm.value.name!,
          description: this.CompanyRegistrationForm.value.description!,
          panNo: this.CompanyRegistrationForm.value.panNo!,
          state: this.CompanyRegistrationForm.value.state!,
          zone: this.CompanyRegistrationForm.value.zone!,
          district: this.CompanyRegistrationForm.value.district!,
          munVdc: this.CompanyRegistrationForm.value.munVdc!,
          wardNo: this.CompanyRegistrationForm.value.wardNo!,
          phone: this.CompanyRegistrationForm.value.phone!,
          customer: false,
        },
        this.user_id
      )
      .subscribe(() => {
        window.location.reload();
      });
  }

  proceed(company: any) {
    localStorage.setItem('companyDetails', JSON.stringify(company));
    this.router.navigateByUrl('/dashboard/demo');
  }
}
