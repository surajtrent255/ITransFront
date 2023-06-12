import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { ToastrService } from 'ngx-toastr';
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

  selectedFile!: File;
  // for select  value Accquire
  provinceId!: number;
  districtId!: number;

  diableDistrictAndWard!: boolean;

  registrationType: string = 'VAT';

  CompanyRegistrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    panNo: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    state: new FormControl('', [Validators.required]),
    district: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    munVdc: new FormControl({ value: '', disabled: true }, Validators.required),
    wardNo: new FormControl({ value: '', disabled: true }, Validators.required),
    phone: new FormControl(
      '',
      Validators.compose([Validators.required, this.phoneValidator])
    ),
    ownerName: new FormControl('', [Validators.required]),
    landline: new FormControl(''),
  });

  phoneValidator(control: AbstractControl) {
    const phoneNumber = control.value;
    const startsWith9 = phoneNumber && phoneNumber.toString().startsWith('9');
    const validLength = phoneNumber && phoneNumber.toString().length === 10;

    if (phoneNumber && (!startsWith9 || !validLength)) {
      return { invalidPhone: true };
    }

    return null;
  }

  constructor(
    private companyService: CompanyServiceService,
    private loginService: LoginService,
    private districtAndProvinceService: DistrictAndProvinceService,
    private toastrService: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      console.log(res.data);
      this.province = res.data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  registerCompany() {
    let englishDate = new Date().toJSON().slice(0, 10);
    if (this.CompanyRegistrationForm.invalid === true) {
    }
    if (this.CompanyRegistrationForm.invalid === false) {
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
            imageName: '',
            imageUrl: '',
            imageId: 0,
            ownerName: this.CompanyRegistrationForm.value.ownerName!,
            landlineNumber: Number(
              this.CompanyRegistrationForm.value.landline!
            ),
            createdDate: new Date().toJSON().slice(0, 10),
            createdDateNepali: String(adToBs(englishDate)),
            registrationType: this.registrationType,
          },
          this.user_id
        )
        .subscribe({
          next: (res) => {
            const closeButton = document.querySelector(
              '.CreateNewCompanyCloseButton'
            ) as HTMLElement;
            this.renderer.selectRootElement(closeButton).click();
            this.toastrService.success('Company Added Successfully');
            this.successfullyAdded.emit(true);

            this.companyService
              .addCompanyLogo(this.selectedFile, res.data)
              .subscribe({
                next: (res) => {
                  console.log(res.data);
                  this.successfullyAdded.emit(true);
                },
                error: (err) => {
                  console.log(err.HttpErrorResponse);
                },
              });
          },
          complete: () => {},
        });
    }
  }
  registrationChange(e: any) {
    this.registrationType = e.target.value;
  }

  stateChange(data: string) {
    if (data === '8') {
      this.CompanyRegistrationForm.get('district')?.disable();
      this.CompanyRegistrationForm.get('munVdc')?.disable();
      this.CompanyRegistrationForm.get('wardNo')?.disable();
    } else {
      this.CompanyRegistrationForm.get('district')?.enable();
      this.CompanyRegistrationForm.get('munVdc')?.enable();
      this.CompanyRegistrationForm.get('wardNo')?.enable();
    }
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
