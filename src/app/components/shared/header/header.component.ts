import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Roles } from 'src/app/models/Roles';
import { UserConfiguration } from 'src/app/models/user-configuration';
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
  constructor(
    private userConfigurationService: UserConfigurationService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { companyId } = parsedData;
    this.userConfigurationService
      .getUserConfiguration(companyId)
      .subscribe((res) => {
        console.log('**********************' + res.data);
        this.userconfiguration = res.data;
      });

    this.userConfigurationService.getRoles().subscribe((res) => {
      this.role = res.data;
    });
  }

  onCheckboxChanged(e: any, userId: number) {
    let status = e.target.checked;
    this.userConfigurationService
      .updateUserStatus(status, userId)
      .subscribe((res) => {
        console.log(res);
      });
  }
  onCompanyCheckboxChanged(e: any, companyId: number) {
    let status = e.target.checked;
    this.userConfigurationService
      .updateUserCompanyStatus(status, companyId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  onRoleChecked(userId: number, roleId: number) {
    this.userConfigurationService
      .updateUserRole(userId, roleId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  hasRole(roleName: string): boolean {
    return this.userconfiguration.some((user) => user.role.includes(roleName));
  }
  onClicked() {
    window.location.reload();
  }
}
