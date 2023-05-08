import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { UserCounter } from 'src/app/models/counter/UserCounter';
import { CounterService } from 'src/app/service/shared/counter/counter.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-counter-user-list',
  templateUrl: './counter-user-list.component.html',
  styleUrls: ['./counter-user-list.component.css'],
})
export class CounterUserListComponent {
  userCounter!: UserCounter[];

  @Output() data = new EventEmitter<{
    userId: number;
    counterId: number;
    status: boolean;
  }>();

  constructor(
    private counterService: CounterService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.getAllUsersForCounterListing();
  }

  getAllUsersForCounterListing() {
    this.counterService
      .getUsersForCounterListing(this.loginService.getCompnayId())
      .subscribe((res) => {
        this.userCounter = res.data;
      });
  }

  enableDisableUser(e: any, userId: number, counterId: number) {
    this.data.emit({ userId, counterId, status: e.target.checked });
  }
}
