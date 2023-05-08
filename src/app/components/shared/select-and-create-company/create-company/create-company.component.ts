import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { District } from 'src/app/models/District';
import { Municipality } from 'src/app/models/Municipality';
import { Province } from 'src/app/models/Province';

import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css'],
})
export class CreateCompanyComponent {
  @Output() successfullyAdded = new EventEmitter<boolean>(false);
  user_id!: number;
  districts!: District[];
  province!: Province[];
  municipality!: Municipality[];

  // for select  value Accquire
  provinceId!: number;
  districtId!: number;

  CompanyRegistrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    panNo: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    munVdc: new FormControl('', [Validators.required]),
    wardNo: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
  });

  constructor(
    private companyService: CompanyServiceService,
    private loginService: LoginService,
    private districtAndProvinceService: DistrictAndProvinceService
  ) {}

  ngOnInit() {
    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      console.log(res.data);
      this.province = res.data;
    });
  }

  registerCompany() {
    this.loginService.userObservable.subscribe((loginUser) => {
      this.user_id = loginUser.user.id;
    });
    console.log(this.CompanyRegistrationForm.value);
    this.companyService
      .addCompany(
        {
          companyId: 0,
          name: this.CompanyRegistrationForm.value.name!,
          email: this.CompanyRegistrationForm.value.email!,
          description: this.CompanyRegistrationForm.value.description!,
          panNo: Number(this.CompanyRegistrationForm.value.panNo),
          state: Number(this.CompanyRegistrationForm.value.state),
          district: this.CompanyRegistrationForm.value.district!,
          munVdc: this.CompanyRegistrationForm.value.munVdc!,
          wardNo: Number(this.CompanyRegistrationForm.value.wardNo),
          phone: Number(this.CompanyRegistrationForm.value.phone),
          customer: false,
        },
        this.user_id
      )
      .subscribe(() => {
        this.successfullyAdded.emit(true);
      });
  }

  stateChange(data: string) {
    this.provinceId = parseInt(data, 10);
    this.districtAndProvinceService
      .getDistrictByProvinceId(this.provinceId)
      .subscribe((res) => {
        this.districts = res.data;
      });
  }

  districtChange() {
    let data = this.CompanyRegistrationForm.value.district!;
    this.districtId = parseInt(data, 10);
    this.districtAndProvinceService
      .getAllmunicipality(this.provinceId, this.districtId)
      .subscribe((res) => {
        this.municipality = res.data;
      });
  }
}
