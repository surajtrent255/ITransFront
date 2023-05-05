import { Injectable } from '@angular/core';
import { RoleService } from '../role.service';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private roleService: RoleService,
    private LoginService: LoginService
  ) {}

  // for millisecond to date (UTC Nepal)
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = this.addZeroPadding(date.getMonth() + 1);
    const day = this.addZeroPadding(date.getDate());
    return `${year}-${month}-${day}`;
  }

  addZeroPadding(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // For role Based Rendering

  getroles() {
    this.roleService.getUserRoleDetailsBasedOnCompanyIdAndUserId;
  }
}
