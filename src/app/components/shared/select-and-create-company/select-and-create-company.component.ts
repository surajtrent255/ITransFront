import { JsonPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';

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
  company!: Company[];
  selectedValue!: string;

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
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.companyService.getCompnayDetails().subscribe((res) => {
      this.company = res.data;
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
    this.companyService
      .addCompany({
        name: this.CompanyRegistrationForm.value.name!,
        description: this.CompanyRegistrationForm.value.description!,
        panNo: this.CompanyRegistrationForm.value.panNo!,
        state: this.CompanyRegistrationForm.value.state!,
        zone: this.CompanyRegistrationForm.value.zone!,
        district: this.CompanyRegistrationForm.value.district!,
        munVdc: this.CompanyRegistrationForm.value.munVdc!,
        wardNo: this.CompanyRegistrationForm.value.wardNo!,
        phone: this.CompanyRegistrationForm.value.phone!,
      })
      .subscribe(() => {
        window.location.reload();
      });
  }

  SelectedData(data: string) {
    this.selectedValue = data;
  }
  proceed(data: string) {
    if (data != 'Select Your Company' && data != '') {
      this.router.navigateByUrl('dashboard');
    }
  }
}
