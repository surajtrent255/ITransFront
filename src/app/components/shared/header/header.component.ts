import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Branch } from 'src/app/models/Branch';
import { BranchConfig } from 'src/app/models/BranchConfig';
import { District } from 'src/app/models/District';
import { Province } from 'src/app/models/Province';
import { Roles } from 'src/app/models/Roles';
import { Demo } from 'src/app/models/demo';
import { User } from 'src/app/models/user';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { BranchService } from 'src/app/service/shared/branch.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { RoleService } from 'src/app/service/shared/role.service';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  userRoleconfiguration!: UserConfiguration[];
  role!: Roles[];
  isChecked!: boolean;
  UsersByCompanyId!: UserConfiguration[];
  assignUserList!: UserConfiguration[];
  allUsers!: UserConfiguration[];
  loggedInUser!: User;
  branch!: Branch[];
  companyName!: string;
  branchId!: number;
  addRoleData!: Demo[];
  districts!: District[];
  province!: Province[];

  branchUsers!: BranchConfig[];

  // for testing

  selectedUserId!: number;
  selectedUser!: string;
  selectedRoleId!: number;
  localStorageCompanyId!: number;

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
    private branchService: BranchService,
    private districtAndProvinceService: DistrictAndProvinceService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { companyId } = parsedData;
    this.localStorageCompanyId = companyId;
    const { name } = parsedData;
    this.companyName = name;
    this.userConfigurationService
      .getUserRoleDetailsBasedOnCompanyId(this.localStorageCompanyId)
      .subscribe((res) => {
        this.userRoleconfiguration = res.data;
      });

    this.userConfigurationService.getRoles().subscribe((res) => {
      this.role = res.data;
    });

    this.userConfigurationService.getAllUser().subscribe((res) => {
      this.allUsers = res.data;
      console.log('All Users');
      console.log(this.allUsers);
    });
    this.loginService.userObservable.subscribe((user) => {
      this.loggedInUser = user;
    });

    this.branchService
      .getBranchDetails(this.localStorageCompanyId)
      .subscribe((res) => {
        this.branch = res.data;
      });

    this.userConfigurationService
      .getUsersByCompanyId(this.localStorageCompanyId)
      .subscribe((res) => {
        this.UsersByCompanyId = res.data;
      });

    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      console.log(res.data);
      this.province = res.data;
    });

    this.branchService
      .getUserForAssignBranchList(this.localStorageCompanyId)
      .subscribe((res) => {
        this.assignUserList = res.data;
      });

    this.branchService
      .getBranchUsersByCompanyId(this.localStorageCompanyId)
      .subscribe((res) => {
        this.branchUsers = res.data;
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

  onRoleInConfigurationChecked(e: any, userId: number, roleId: number) {
    let status = e.target.checked;
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { companyId } = parsedData;
    this.roleService
      .updateUserRoleStatus(status, userId, companyId, roleId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  onRoleChecked(e: any, roleId: number) {
    alert('Are You Sure');

    let status = e.target.checked;
    console.log(status);

    if (status === true) {
      this.roleService
        .addToUserRole(this.selectedUserId, this.localStorageCompanyId, roleId)
        .subscribe((res) => {
          console.log(res);
        });
    }
    if (status === false) {
      alert('You Have Already Added This Role');
    }
  }

  hasRole(roleName: string) {
    if (!this.addRoleData) {
      return;
    } else {
      return this.addRoleData.some((user) => user.role.includes(roleName));
    }
  }

  onClicked() {
    window.location.reload();
  }

  onAssignCompanyChange(e: any, userId: number) {
    let status = e.target.checked;
    alert('Are You Sure You Cannot Revert This');
    if (status == true) {
      let companyId = this.loginService.getCompnayId();
      this.userConfigurationService
        .assignCompanyToUser(companyId, userId)
        .subscribe((res) => {
          console.log(res);
        });
      this.roleService.addToUserRole(userId, companyId, 2).subscribe((res) => {
        console.log(res);
      });
    }
    if (status === false) {
      alert('You Have Already Assigned the User');
      return;
    }
  }

  registerBranch() {
    this.branchService
      .addBranch({
        id: 0,
        companyId: this.localStorageCompanyId,
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

  addRole(userId: number, firstName: string, lastName: string) {
    this.selectedUser = firstName + ' ' + lastName;
    this.selectedUserId = userId;
    this.roleService
      .getUserRoleDetailsBasedOnCompanyIdAndUserId(
        this.localStorageCompanyId,
        userId
      )
      .subscribe((res) => {
        this.addRoleData = res.data;
      });
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

  stateChange(data: string) {
    const provinceId = parseInt(data, 10);
    this.districtAndProvinceService
      .getDistrictByProvinceId(provinceId)
      .subscribe((res) => {
        this.districts = res.data;
      });
  }

  onBranchCheckboxChanged(e: any, userId: number, branchId: number) {
    let status = e.target.checked;
    alert('Are You Sure');
    this.branchService
      .enableDisableUser(status, userId, this.localStorageCompanyId, branchId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  logout() {
    this.loginService.logout();
  }
}
