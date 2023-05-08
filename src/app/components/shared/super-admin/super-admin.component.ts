import { Component, ViewEncapsulation } from '@angular/core';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { SuperAdminService } from 'src/app/service/shared/Super Admin/super-admin.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: [
    './super-admin.component.css',
    '../../../../assets/resources/css/styles.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SuperAdminComponent {
  users!: UserConfiguration[];
  selectedUserIdForAssign!: number;
  selectedEnableDisableUser!: number;
  selectedEnableDisableUserStatus!: boolean;

  constructor(
    private superAdminService: SuperAdminService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.getAllUsersForSuperAdminListing();
  }

  getAllUsersForSuperAdminListing() {
    this.superAdminService
      .getAllUsersForSuperAdminListing()
      .subscribe((res) => {
        this.users = res.data;
      });
  }
  assignAdminRole(userId: number) {
    this.selectedUserIdForAssign = userId;
  }
  enableDisable(userId: number, e: any) {
    this.selectedEnableDisableUser = userId;
    this.selectedEnableDisableUserStatus = e.target.checked;
  }
  logout() {
    this.loginService.logout();
  }

  submit() {
    console.log('Hit');
    if (this.selectedUserIdForAssign) {
      this.superAdminService
        .assignAdminRoleBySuperAdmin(this.selectedUserIdForAssign)
        .subscribe({
          next: (res) => {
            this.getAllUsersForSuperAdminListing();
            console.log(res);
          },
        });
    }
    if (this.selectedEnableDisableUser) {
      this.superAdminService
        .updateUserStatusFromSuperAdmin(
          this.selectedEnableDisableUserStatus,
          this.selectedEnableDisableUser
        )
        .subscribe({
          next: (res) => {
            this.getAllUsersForSuperAdminListing();
            console.log('enable');
          },
        });
    }
  }
}
