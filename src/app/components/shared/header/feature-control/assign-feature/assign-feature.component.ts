import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatureControl } from 'src/app/models/Feature Control/feature-control';
import { UserFeature } from 'src/app/models/Feature Control/user-feature';
import { FeatureControlService } from 'src/app/service/shared/Feature-Control/feature-control.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-assign-feature',
  templateUrl: './assign-feature.component.html',
  styleUrls: ['./assign-feature.component.css'],
})
export class AssignFeatureComponent {
  @Input() userId!: number;
  @Output() ControlAssignedSuccess = new EventEmitter<boolean>(false);

  feature!: FeatureControl[];
  userFeature!: UserFeature[];
  SelectedUser!: number;
  companyName!: string;
  controls!: number;

  constructor(
    private featureControlService: FeatureControlService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('companyDetails');
    const parsedData = JSON.parse(data || '{}');
    const { name, companyId } = parsedData;
    this.companyName = name;

    this.featureControlService.getFeatureControls().subscribe((res) => {
      this.feature = res.data;
    });
  }

  ngOnChanges() {
    this.SelectedUser = this.userId;
    this.getAllFeatureControlOfUserByUserId();
  }

  getAllFeatureControlOfUserByUserId() {
    this.featureControlService
      .getAllFeatureControlOfUserByUserId(
        this.loginService.getCompnayId(),
        this.SelectedUser
      )
      .subscribe((res) => {
        console.log('FEATURE');
        console.log(res.data);
        this.userFeature = res.data;
      });
  }

  hasControl(feature: string) {
    if (!this.userFeature) {
      return;
    } else {
      return this.userFeature.some((userControl) =>
        userControl.feature.includes(feature)
      );
    }
  }

  AddFeature(e: any, featureId: number) {
    let status = e.target.checked;
    this.controls = featureId;
    // if (status === true) {
    //   this.controls.push(featureId);
    // } else {
    //   this.controls.pop();
    // }
  }

  AssignControl() {
    if (this.controls) {
      this.featureControlService
        .assignFeatureControlToUser(
          this.controls,
          this.SelectedUser,
          this.loginService.getCompnayId()
        )
        .subscribe({
          next: (res) => {
            this.getAllFeatureControlOfUserByUserId();
            this.ControlAssignedSuccess.emit(true);
          },
        });
    }
  }
}
