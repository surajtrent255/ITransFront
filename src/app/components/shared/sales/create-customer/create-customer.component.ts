import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
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

  @ViewChild('closeCustomer') closeCustomer!: ElementRef;

  @Output() customerAddedSuccessMsg = new EventEmitter<boolean>(false);

  constructor(
    private loginService: LoginService,
    private companyService: CompanyServiceService
  ) { }

  CompanyRegistrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    panNo: new FormControl(''),
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    munVdc: new FormControl('', [Validators.required]),
    wardNo: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
  });

  registerCompany() {
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
          description: this.CompanyRegistrationForm.value.description!,
          panNo: this.CompanyRegistrationForm.value.panNo!,
          state: this.CompanyRegistrationForm.value.state!,
          district: this.CompanyRegistrationForm.value.district!,
          munVdc: this.CompanyRegistrationForm.value.munVdc!,
          wardNo: this.CompanyRegistrationForm.value.wardNo!,
          phone: this.CompanyRegistrationForm.value.phone!,
          customer: true!,
        },
        this.user_id
      )
      .subscribe(() => {
        const button = this.closeCustomer.nativeElement;
        button.click();
        this.customerAddedSuccessMsg.emit(true);
      });
  }
}
