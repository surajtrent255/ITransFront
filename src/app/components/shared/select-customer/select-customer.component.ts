import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.component.html',
  styleUrls: ['./select-customer.component.css']
})
export class SelectCustomerComponent {

  @Input() selectMenusForCompanies !: Company[];
  @Output() compIdEvent = new EventEmitter<number>();

  title: string = "Lenders"
  setCompanyId(id: number) {

    this.compIdEvent.emit(id);
    const closeCustomerPopUpEl = document.getElementById("closeCompanyPop") as HTMLAnchorElement;
    closeCustomerPopUpEl.click();
  }


}
