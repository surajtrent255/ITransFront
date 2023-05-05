import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserFeature } from 'src/app/models/Feature Control/user-feature';
import { FeatureControlService } from 'src/app/service/shared/Feature-Control/feature-control.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-user-feature-list',
  templateUrl: './user-feature-list.component.html',
  styleUrls: ['./user-feature-list.component.css'],
})
export class UserFeatureListComponent {
  @Input() IsTriggered!: boolean;
  @Input() headerEvent!: boolean;
  @Output() data = new EventEmitter<{
    status: boolean;
    userId: number;
    featureId: number;
  }>();

  userFeature!: UserFeature[];

  constructor(
    private featureControlService: FeatureControlService,
    private LoginService: LoginService
  ) {}

  ngOnInit() {
    this.getFeatureControlOfUsersForListing();
  }

  getFeatureControlOfUsersForListing() {
    this.featureControlService
      .getFeatureControlOfUsersForListing(this.LoginService.getCompnayId())
      .subscribe((res) => {
        this.userFeature = res.data;
      });
  }

  ngOnChanges() {
    if (this.IsTriggered === true) {
      this.getFeatureControlOfUsersForListing();
    }
    if (this.headerEvent === true) {
      this.getFeatureControlOfUsersForListing();
    }
  }
  onUserFeatureChange(e: any, userId: number, featureId: number) {
    this.data.emit({ status: e.target.checked, userId, featureId });
  }
}
