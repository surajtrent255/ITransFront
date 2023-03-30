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
  constructor(private userConfigurationService: UserConfigurationService) {}

  ngOnInit() {
    this.userConfigurationService.getUserConfiguration().subscribe((res) => {
      this.userconfiguration = res.data;
    });
  }
}
