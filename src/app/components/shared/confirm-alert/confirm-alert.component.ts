import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-alert',
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['./confirm-alert.component.css']
})
export class ConfirmAlertComponent {

  @Output() destroyConfirmAlertSectionEmitter = new EventEmitter<boolean>();
  @Input() msg: string = '';

  emitStatus(status: boolean) {
    this.destroyConfirmAlertSectionEmitter.emit(status)
    const closeAlertBtn = document.getElementById("closeAlertAch") as HTMLAnchorElement;
    closeAlertBtn.click();
  }


  destroyAlertComp() {
    this.destroyConfirmAlertSectionEmitter.emit(false);
  }
}
