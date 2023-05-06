import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.component.html',
  styleUrls: ['./select-customer.component.css']
})
export class SelectCustomerComponent {

  @Input() selectMenusForCompanies !: Company[];
  @Output() compIdEvent = new EventEmitter<number>();

  title: string = "";

  @ViewChild('selectedCustomerBtn', { static: false })
  selectCompanyCustOrSth!: ElementRef;
  @ViewChild("createCustomerBtn", { static: false }) createCustomerBtn !: ElementRef;

  @Output() destroySelectCompEmitter = new EventEmitter<boolean>(false);
  @Output() fetchCustomerEventEmitter = new EventEmitter<boolean>(false);

  createCustomerEnable: boolean = false;

  constructor(private toastrService: ToastrService) { }

  ngOnInit() {

  }

  ngOnChanges() {
    setTimeout(() => {
      this.selectCompanyCustOrSth.nativeElement.focus();
    })
    setTimeout(() => {
      this.createCustomerBtn.nativeElement.focus();
    })

  }


  setCompanyId(id: number) {

    this.compIdEvent.emit(id);
    const closeCustomerPopUpEl = document.getElementById("closeCompanyPop") as HTMLAnchorElement;
    closeCustomerPopUpEl.click();
  }


  onButtonKeyUp(event: KeyboardEvent, compId: number) {
    if (event.key === 'Enter') {
      this.setCompanyId(compId)
    }
  }


  onButtonKeyUpForDispalyAddCustomerPopup(event: KeyboardEvent) {
    const eventInputTarget = event.target as HTMLInputElement;
    if (eventInputTarget.name === 'createCustDecs') {
      if (eventInputTarget.value === '1') {
        if (event.key === 'Enter') {
          event.stopPropagation();
          this.displayAddCustomerPopup();


        }
      } else {
        if (event.key === 'Enter') {
          this.destroySelectCustomer();
          event.stopPropagation();

        }
      }
    }
  }
  destroySelectCustomer() {
    this.destroySelectCompEmitter.emit(true);
  }

  displayAddCustomerPopup() {
    this.createCustomerEnable = true;
    const createNewCustomerEl = document.getElementById("createNewCustomer") as HTMLButtonElement;
    createNewCustomerEl.click();
  }

  customerAdded($event) {
    this.createCustomerEnable = false;
    if ($event === true) {
      this.toastrService.success("Customer Has been added ");
      this.fetchCustomerEventEmitter.emit(true);
    }
  }


}
