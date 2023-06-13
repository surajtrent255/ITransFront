import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { District } from 'src/app/models/District';
import { Municipality } from 'src/app/models/Municipality';
import { Province } from 'src/app/models/Province';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent {
  company: Company = new Company();
  user: User = new User();
  user_id!: number;

  @Input() title!: string;
  @Input() customerPanOrPhone: Number = 0;
  @ViewChild('closeCustomer') closeCustomer!: ElementRef;

  @Output() customerAddedSuccessMsg = new EventEmitter<number>();

  districts!: District[];
  province!: Province[];
  municipality!: Municipality[];

  // for select  value Accquire
  provinceId!: number;
  districtId!: number;
  registrationType: string = 'VAT';

  constructor(
    private loginService: LoginService,
    private companyService: CompanyServiceService,
    private districtAndProvinceService: DistrictAndProvinceService
  ) { }

  ngOnInit() {
    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      console.log(res.data);
      this.province = res.data;
    });
  }

  ngAfterViewInit() {
    // alert(this.customerPanOrPhone)
  }
  CompanyRegistrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    description: new FormControl(''),
    panNo: new FormControl(''),
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    munVdc: new FormControl('', [Validators.required]),
    wardNo: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    landLineNo: new FormControl('')
  });


  registrationChange(e: any) {
    this.registrationType = e.target.value;
  }
  registerCompany(form: any) {
    this.loginService.userObservable.subscribe((loginUser) => {
      this.user = loginUser;
      this.user_id = loginUser.user.id;
      console.log(this.user.user.id);
    });
    console.log(this.CompanyRegistrationForm);
    console.log('*******************');
    this.companyService
      .addCompany(
        {
          companyId: 0,
          name: this.CompanyRegistrationForm.value.name!,
          email: this.CompanyRegistrationForm.value.email!,
          description: this.CompanyRegistrationForm.value.description!,
          panNo: Number(this.CompanyRegistrationForm.value.panNo!),
          state: Number(this.CompanyRegistrationForm.value.state!),
          district: this.CompanyRegistrationForm.value.district!,
          munVdc: this.CompanyRegistrationForm.value.munVdc!,
          wardNo: Number(this.CompanyRegistrationForm.value.wardNo!),
          phone: Number(this.CompanyRegistrationForm.value.phone!),
          customer: true!,
          imageName: '',
          imageUrl: '',
          imageId: 0,
          createdDate: '',
          createdDateNepali: '',
          landlineNumber: Number(this.CompanyRegistrationForm.value.landLineNo!),
          ownerName: this.CompanyRegistrationForm.value.ownerName!,
          registrationType: this.registrationType,
        },
        this.user_id
      )
      .subscribe((data) => {
        form.reset();
        this.closeCustomer.nativeElement.click();
        this.customerAddedSuccessMsg.emit(data.data);
      });
  }

  stateChange(data: string) {
    this.provinceId = parseInt(data, 10);
    if (this.provinceId === 8) {
      this.districts = [];
      this.municipality = [];
      // Remove Validators.required dynamically
      this.CompanyRegistrationForm.get('district')?.clearValidators();
      this.CompanyRegistrationForm.get('district')?.updateValueAndValidity();

      this.CompanyRegistrationForm.get('munVdc')?.clearValidators();
      this.CompanyRegistrationForm.get('munVdc')?.updateValueAndValidity();

      this.CompanyRegistrationForm.get('wardNo')?.clearValidators();
      this.CompanyRegistrationForm.get('wardNo')?.updateValueAndValidity();
      return;
    } else {
      this.CompanyRegistrationForm.get('district')?.setValidators([Validators.required]);
      this.CompanyRegistrationForm.get('district')?.updateValueAndValidity();

      this.CompanyRegistrationForm.get('munVdc')?.setValidators([Validators.required]);
      this.CompanyRegistrationForm.get('munVdc')?.updateValueAndValidity();

      this.CompanyRegistrationForm.get('wardNo')?.setValidators([Validators.required]);
      this.CompanyRegistrationForm.get('wardNo')?.updateValueAndValidity();
    }
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
