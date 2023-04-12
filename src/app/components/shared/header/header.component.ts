import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Branch } from 'src/app/models/Branch';
import { Roles } from 'src/app/models/Roles';
import { User } from 'src/app/models/user';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { BranchService } from 'src/app/service/shared/branch.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  userconfiguration!: UserConfiguration[];
  role!: Roles[];
  isChecked!: boolean;
  allUser!: UserConfiguration[];
  UsersByCompanyId!: UserConfiguration[];
  loggedInUser!: User;
  branch!: Branch[];
  companyName!: string;
  branchId!: number;
  addRoleData!: UserConfiguration;

  BranchRegistrationForm = new FormGroup({
    BranchName: new FormControl('', [Validators.required]),
    BranchAbbvr: new FormControl('', [Validators.required]),
    BranchDescription: new FormControl(''),
    BranchPanNo: new FormControl(''),
    BranchState: new FormControl('', [Validators.required]),
    BranchZone: new FormControl('', [Validators.required]),
    BranchDistrict: new FormControl('', [Validators.required]),
    BranchMunVdc: new FormControl('', [Validators.required]),
    BranchWardNo: new FormControl('', [Validators.required]),
    BranchPhone: new FormControl(''),
  });

  constructor(
    private userConfigurationService: UserConfigurationService,
    private loginService: LoginService,
    private branchService: BranchService
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { companyId } = parsedData;
    const { name } = parsedData;
    this.companyName = name;
    this.userConfigurationService
      .getUserConfiguration(companyId)
      .subscribe((res) => {
        this.userconfiguration = res.data;
      });

    this.userConfigurationService.getRoles().subscribe((res) => {
      this.role = res.data;
    });

    this.userConfigurationService.getAllUser().subscribe((res) => {
      this.allUser = res.data;
      console.log('all Users');
      console.log(this.allUser);
    });

    this.loginService.userObservable.subscribe((user) => {
      this.loggedInUser = user;
    });

    this.branchService.getBranchDetails(companyId).subscribe((res) => {
      this.branch = res.data;
    });

    this.userConfigurationService
      .getUsersByCompanyId(companyId)
      .subscribe((res) => {
        this.UsersByCompanyId = res.data;
      });
  }

  get name() {
    return this.BranchRegistrationForm.get('BranchName');
  }

  get abbvr() {
    return this.BranchRegistrationForm.get('BranchAbbvr');
  }

  get description() {
    return this.BranchRegistrationForm.get('BranchDescription');
  }

  get panNo() {
    return this.BranchRegistrationForm.get('BranchPanNo');
  }

  get state() {
    return this.BranchRegistrationForm.get('BranchState');
  }

  get zone() {
    return this.BranchRegistrationForm.get('BranchZone');
  }

  get district() {
    return this.BranchRegistrationForm.get('BranchDistrict');
  }

  get munVdc() {
    return this.BranchRegistrationForm.get('BranchMunVdc');
  }

  get wardNo() {
    return this.BranchRegistrationForm.get('BranchWardNo');
  }

  get phone() {
    return this.BranchRegistrationForm.get('BranchPhone');
  }
  onCheckboxChanged(e: any, userId: number) {
    let status = e.target.checked;
    this.userConfigurationService
      .updateUserCompanyStatus(status, userId)
      .subscribe((res) => {
        console.log('Company Updated');
      });
  }

  onCompanyCheckboxChanged(e: any, userId: number) {
    let status = e.target.checked;
    this.userConfigurationService
      .updateUserCompanyStatus(status, userId)
      .subscribe((res) => {
        console.log('Company Updated');
      });
  }

  onRoleChecked(userId: number, roleId: number) {
    this.userConfigurationService
      .updateUserRole(userId, roleId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  onAssignedRoleChecked(userId: number, roleId: number) {
    alert('Assign Role Changed');
  }

  hasRole(roleName: string): boolean {
    return this.userconfiguration.some((user) => user.role.includes(roleName));
  }

  onClicked() {
    window.location.reload();
  }

  onAssignCompanyChange(e: any, userId: number) {
    let status = e.target.checked;

    if (status == true) {
      let companyId = this.loginService.getCompnayId();
      this.userConfigurationService
        .assignCompanyToUser(companyId, userId)
        .subscribe((res) => {
          console.log(res);
        });
    }
  }

  registerBranch() {
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { companyId } = parsedData;
    this.branchService
      .addBranch({
        id: 0,
        companyId: companyId,
        name: this.BranchRegistrationForm.value.BranchName!,
        abbrv: this.BranchRegistrationForm.value.BranchAbbvr!,
        description: this.BranchRegistrationForm.value.BranchDescription!,
        panNo: this.BranchRegistrationForm.value.BranchPanNo!,
        state: this.BranchRegistrationForm.value.BranchState!,
        zone: this.BranchRegistrationForm.value.BranchZone!,
        district: this.BranchRegistrationForm.value.BranchDistrict!,
        munVdc: this.BranchRegistrationForm.value.BranchMunVdc!,
        wardNo: this.BranchRegistrationForm.value.BranchWardNo!,
        phone: this.BranchRegistrationForm.value.BranchPhone!,
      })
      .subscribe((res) => {
        console.log(res);
      });

    window.location.reload();
  }

  addRole(userConfig: UserConfiguration) {
    this.addRoleData = userConfig;
    console.log(this.addRoleData.firstName);
  }

  onAssignBranchChange(e: any, userId: number) {
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { companyId } = parsedData;
    this.branchService
      .AssignBranchToUser(userId, this.branchId, companyId)
      .subscribe((res) => {
        console.log('Data Sent From Assign Branch');
      });
  }

  onAssinBranchButtonClick(branchId: number) {
    this.branchId = branchId;
  }
}
