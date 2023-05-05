import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { CounterService } from 'src/app/service/shared/counter/counter.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-assign-counter',
  templateUrl: './assign-counter.component.html',
  styleUrls: ['./assign-counter.component.css'],
})
export class AssignCounterComponent {
  @Input() counterId!: number;
  @Input() branchId!: number;
  @Output() successFull = new EventEmitter<boolean>(false);

  assignCounterUsers!: UserConfiguration[];
  LoggedInUserId!: number;
  SelectedUserForAssignCounter!: number;

  BranchId!: number;

  constructor(
    private counterService: CounterService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.LoggedInUserId = this.loginService.getUserId();
  }

  ngOnChanges() {
    this.BranchId = this.branchId;
    this.getUsersForAssignCounter();
  }

  getUsersForAssignCounter() {
    this.counterService
      .getUsersForAssignCounter(this.loginService.getCompnayId(), this.BranchId)
      .subscribe((res) => {
        this.assignCounterUsers = res.data;
      });
  }

  assignCounterChange(e: any, userId: number) {
    if (e.target.checked === true) {
      this.SelectedUserForAssignCounter = userId;
    }
  }

  onSave() {
    this.counterService
      .assignUsersToCounter({
        branchId: this.BranchId,
        companyId: this.loginService.getCompnayId(),
        counterId: this.counterId,
        userId: this.SelectedUserForAssignCounter,
        date: new Date(),
        id: 0,
        name: '',
        status: true,
      })
      .subscribe({
        next: (res) => {
          this.getUsersForAssignCounter();
          this.successFull.emit(true);
        },
      });
  }
}
