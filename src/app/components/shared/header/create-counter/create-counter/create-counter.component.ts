import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CounterService } from 'src/app/service/shared/counter/counter.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-counter',
  templateUrl: './create-counter.component.html',
  styleUrls: ['./create-counter.component.css'],
})
export class CreateCounterComponent {
  @Input() branchId!: number;
  @Output() success = new EventEmitter<boolean>(false);
  BranchId!: number;

  CounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    private counterService: CounterService,
    private loginService: LoginService
  ) {}

  ngOnChanges() {
    this.BranchId = this.branchId;
  }

  OnSubmit() {
    this.counterService
      .addCounterDetails({
        id: 0,
        branchId: this.BranchId,
        companyId: this.loginService.getCompnayId(),
        date: new Date(),
        name: this.CounterForm.value.name!,
        status: true,
        userId: 0,
        counterId: 0,
      })
      .subscribe({
        next: (res) => {
          this.success.emit(true);
        },
      });
  }
}
