import { Component } from '@angular/core';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  userconfiguration!: UserConfiguration[];
  isChecked!: boolean;
  constructor(private userConfigurationService: UserConfigurationService) {}

  ngOnInit() {
    this.userConfigurationService.getUserConfiguration().subscribe((res) => {
      console.log(res.data);
      this.userconfiguration = res.data;
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
}
