import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { District } from 'src/app/models/District';
import { Municipality } from 'src/app/models/Municipality';
import { Province } from 'src/app/models/Province';
import { Company } from 'src/app/models/company';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-profile-company-info',
  templateUrl: './edit-profile-company-info.component.html',
  styleUrls: ['./edit-profile-company-info.component.css'],
})
export class EditProfileCompanyInfoComponent {
  companydetails: Company = new Company();
  districts!: District[];
  province!: Province[];
  municipality!: Municipality[];
  registrationType: string = 'VAT';
  provinceId!: number;
  districtId!: number;
  constructor(
    private loginService: LoginService,
    private districtAndProvinceService: DistrictAndProvinceService,
    private companyService: CompanyServiceService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.companydetails = this.loginService.getCompany();
    console.log(this.companydetails);
    this.stateChange(String(this.companydetails.state));
    this.districtChange();

    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      this.province = res.data;
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
    let data = this.companydetails.district!;
    this.districtId = parseInt(data, 10);
    this.districtAndProvinceService
      .getAllmunicipality(this.provinceId, this.districtId)
      .subscribe((res) => {
        this.municipality = res.data;
      });
  }

  registrationChange(e: any) {
    this.registrationType = e.target.value;
  }

  registerCompany() {
    console.log(this.companydetails);

    this.companyService.editCompany(this.companydetails).subscribe({
      next: (res) => {
        this.toastrService.success(res);
      },
      error: (error) => {
        this.toastrService.error(error);
      },
    });
  }
}
