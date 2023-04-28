import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import $ from 'jquery';
import { Municipality } from 'src/app/models/Municipality';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  userRoleconfiguration!: UserConfiguration[];
  role!: Roles[];
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
  municipality!: Municipality[];

  branchUsers!: BranchConfig[];

  // for testing

  selectedUserId!: number;
  selectedUser!: string;
  selectedRoleId!: number;
  localStorageCompanyId!: number;

  // Role Testing
  status!: boolean;
  roleId!: number;
  PopupRoleId: number[] = [];

  // Assign Company
  assignCompanyStatus!: boolean;
  assignCompanyUserId: number[] = [];

  // for select  value Accquire
  provinceId!: number;
  districtId!: number;

  // branch
  branchUserId!: number;
  branchUserTabStatus!: boolean;

  // for User Configuration common tab
  usersTabsStatus!: boolean;
  userRoleTabStatus!: boolean;

  profileCardActive = false;

  BranchRegistrationForm = new FormGroup({
    BranchName: new FormControl('', [Validators.required]),
    BranchAbbvr: new FormControl('', [Validators.required]),
    BranchDescription: new FormControl(''),
    BranchPanNo: new FormControl(''),
    BranchState: new FormControl('', [Validators.required]),
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

  @ViewChild('profile') profile!: ElementRef;
  @ViewChild('profileCard') profileCard!: ElementRef;

  ngAfterViewInit() {
    $('.profile-button').on('click', function (event) {
      event.stopPropagation();
      $('.profile-card').toggleClass('active');
    });

    $('body').on('click', function (event) {
      if (!$(event.target).closest('.profile').length) {
        $('.profile-card').removeClass('active');
      }
    });
  }

  ngOnInit() {
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { companyId } = parsedData;
    this.localStorageCompanyId = companyId;
    const { name } = parsedData;
    this.companyName = name;

    this.userConfigurationService.getRoles().subscribe((res) => {
      this.role = res.data;
    });

    this.loginService.userObservable.subscribe((user) => {
      this.loggedInUser = user;
    });

    this.getAllBranchDetails();

    this.getBranchUsersByCompanyId();

    this.getUsersByCompanyId();

    this.getUserRoleDetailsBasedOnCompanyId();
    this.getUserForAssignBranchList();
    this.getAllUser();

    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      console.log(res.data);
      this.province = res.data;
    });
  }
  getAllUser() {
    this.userConfigurationService
      .getAllUser(this.localStorageCompanyId)
      .subscribe((res) => {
        this.allUsers = res.data;
        console.log('All Users');
        console.log(this.allUsers);
      });
  }

  getUserForAssignBranchList() {
    this.branchService
      .getUserForAssignBranchList(this.localStorageCompanyId)
      .subscribe((res) => {
        this.assignUserList = res.data;
      });
  }

  getUserRoleDetailsBasedOnCompanyId() {
    this.userConfigurationService
      .getUserRoleDetailsBasedOnCompanyId(this.localStorageCompanyId)
      .subscribe((res) => {
        this.userRoleconfiguration = res.data;
      });
  }

  getUsersByCompanyId() {
    this.userConfigurationService
      .getUsersByCompanyId(this.localStorageCompanyId)
      .subscribe((res) => {
        this.UsersByCompanyId = res.data;
      });
  }

  getBranchUsersByCompanyId() {
    this.branchService
      .getBranchUsersByCompanyId(this.localStorageCompanyId)
      .subscribe((res) => {
        this.branchUsers = res.data;
      });
  }

  getAllBranchDetails() {
    this.branchService
      .getBranchDetails(this.localStorageCompanyId)
      .subscribe((res) => {
        this.branch = res.data;
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
    this.usersTabsStatus = status;
    this.userConfigurationService
      .updateUserCompanyStatus(status, userId)
      .subscribe((res) => {
        console.log('Company Updated');
      });
  }

  onRoleInConfigurationChecked(e: any, userId: number, roleId: number) {
    let status = e.target.checked;
    this.userRoleTabStatus = status;
    this.roleService
      .updateUserRoleStatus(status, userId, this.localStorageCompanyId, roleId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  onRoleChecked(e: any, roleId: number) {
    let status = e.target.checked;
    this.roleId = roleId;
    if (status === true) {
      this.PopupRoleId.push(roleId);
    } else {
      this.PopupRoleId.pop();
    }
  }

  hasRole(roleName: string) {
    if (!this.addRoleData) {
      return;
    } else {
      return this.addRoleData.some((user) => user.role.includes(roleName));
    }
  }

  onAssignRolePopupSaveClicked() {
    if (this.PopupRoleId !== null) {
      this.roleService
        .addToUserRole(
          this.selectedUserId,
          this.localStorageCompanyId,
          this.PopupRoleId
        )
        .subscribe({
          next: () => {
            this.getUserRoleDetailsBasedOnCompanyId();
            this.PopupRoleId = [];
          },
        });
    }
  }

  onAssignCompanyChange(e: any, userId: number) {
    this.assignCompanyStatus = e.target.checked;
    let status = e.target.checked;
    if ((status = true)) {
      this.assignCompanyUserId.push(userId);
    } else {
      this.assignCompanyUserId.pop();
    }
  }

  onAssignCompanySaveClicked(e: any) {
    if (this.assignCompanyStatus !== null) {
      if (this.assignCompanyStatus == true) {
        let companyId = this.loginService.getCompnayId();
        this.userConfigurationService
          .assignCompanyToUser(companyId, this.assignCompanyUserId)
          .subscribe({
            next: () => {
              this.getUsersByCompanyId();
              this.getUserForAssignBranchList();
              this.getAllUser();
              this.assignCompanyUserId = [];
            },
          });
        this.roleService
          .addToMultipleUserRole(this.assignCompanyUserId, companyId, 2)
          .subscribe({
            next: () => {
              this.getUserRoleDetailsBasedOnCompanyId();
            },
          });
      }
      if (this.assignCompanyStatus === false) {
        alert('Please Try again');
        return;
      }
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
        state: this.BranchRegistrationForm.value.BranchState!,
        district: this.BranchRegistrationForm.value.BranchDistrict!,
        munVdc: this.BranchRegistrationForm.value.BranchMunVdc!,
        wardNo: this.BranchRegistrationForm.value.BranchWardNo!,
        phone: this.BranchRegistrationForm.value.BranchPhone!,
      })
      .subscribe({
        next: (res) => {
          this.getAllBranchDetails();
          // this.BranchRegistrationForm.reset();
        },
      });
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

  onAssignBranchPopupCheckBoxChange(e: any, userId: number) {
    if (e.target.checked === true) {
      this.branchUserId = userId;
    }
  }
  onBranchAssignPopupSaveButtonClicked(e: any) {
    if (this.branchUserId !== null && e !== null) {
      this.branchService
        .AssignBranchToUser(
          this.branchUserId,
          this.branchId,
          this.localStorageCompanyId
        )
        .subscribe({
          next: () => {
            this.getBranchUsersByCompanyId();
          },
        });
    }
  }

  onBranchCheckboxChanged(e: any, userId: number, branchId: number) {
    let status = e.target.checked;
    this.branchUserTabStatus = status;
    this.branchService
      .enableDisableUser(status, userId, this.localStorageCompanyId, branchId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  BranchConfigurationTabs() {
    if (this.BranchConfigurationTabs !== null) {
      this.getBranchUsersByCompanyId();
    }
  }

  onAssinBranchButtonClick(branchId: number) {
    this.branchId = branchId;
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
    let data = this.BranchRegistrationForm.value.BranchDistrict!;
    this.districtId = parseInt(data, 10);
    this.districtAndProvinceService
      .getAllmunicipality(this.provinceId, this.districtId)
      .subscribe((res) => {
        this.municipality = res.data;
      });
  }

  logout() {
    this.loginService.logout();
  }

  // userConfiguration Tabs logic
  UserConfigurationTabs() {
    if (this.usersTabsStatus !== null) {
      this.getUsersByCompanyId();
    }

    if (this.userRoleTabStatus !== null) {
      this.getUserRoleDetailsBasedOnCompanyId();
    }
  }
}
