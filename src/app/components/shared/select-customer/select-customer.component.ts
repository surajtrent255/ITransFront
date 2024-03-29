import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.component.html',
  styleUrls: ['./select-customer.component.css'],
})
export class SelectCustomerComponent {
  @Input() customerMetaData!: CustomerMetaData;
  @Output() compIdEvent = new EventEmitter<number>();

  @Input() title!: string;

  @ViewChild('selectedCustomerBtn', { static: false })
  selectCompanyCustOrSth!: ElementRef;
  @ViewChild('createCustomerBtn', { static: false })
  createCustomerBtn!: ElementRef;

  @ViewChild(`donotCreateCustomerBtn`, { static: false }) dontCreateCustomerBtn !: ElementRef;
  showableALertPopup: boolean = true;

  @ViewChild(`yesPopup`, { static: false }) yesPopUpBtn !: ElementRef;
  @ViewChild(`noPopup`, { static: false }) noPopUpBtn!: ElementRef

  @Output() destroySelectCompEmitter = new EventEmitter<boolean>(false);
  @Output() fetchCustomerEventEmitter = new EventEmitter<number>();

  createCustomerEnable: boolean = false;

  constructor(private toastrService: ToastrService, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() { }

  ngOnChanges() {
    setTimeout(() => {
      this.selectCompanyCustOrSth?.nativeElement.focus();
    });
    setTimeout(() => {
      this.createCustomerBtn?.nativeElement.focus();
      // this.dontCreateCustomerBtn?.nativeElement.focus();
    });
  }

  ngAfterViewInit() {
    // const yesButton = this.el.nativeElement.querySelector('#yesPopup');
    // this.renderer.listen(yesButton, 'click', () => {
    //   alert("yes")
    // });

    // const noButton = this.el.nativeElement.querySelector('#noPopup');
    // this.renderer.listen(noButton, 'click', () => {
    //   alert("No")
    // });
  }

  setCompanyId(id: number) {
    this.compIdEvent.emit(id);
    const closeCustomerPopUpEl = document.getElementById(
      'closeCompanyPop'
    ) as HTMLAnchorElement;
    closeCustomerPopUpEl.click();
  }

  onButtonKeyUp(event: KeyboardEvent, compId: number) {
    if (event.key === 'Enter') {
      this.setCompanyId(compId);
    }
  }


  onButtonKeyUpForDispalyAddCustomerPopup(event: KeyboardEvent) {
    const eventInputTarget = event.target as HTMLInputElement;
    if (eventInputTarget.name === 'createCustDecs') {
      if (eventInputTarget.value === '1') {
        if (event.key === 'Enter') {
          setTimeout(() => {
            this.showableALertPopup = false;
            this.displayAddCustomerPopup();
          }, 500)
        }
      } else {
        if (event.key === 'Enter') {
          this.destroySelectCustomer();
          event.stopPropagation();
        }
      }
    }
  }

  alertYes() {
    this.showableALertPopup = false;
    this.displayAddCustomerPopup();
  }

  alertNo() {
    this.destroySelectCustomer();
  }

  destroySelectCustomer() {
    this.destroySelectCompEmitter.emit(true);

  }

  displayAddCustomerPopup() {
    this.createCustomerEnable = true;
    const createNewCustomerEl = document.getElementById(
      'createNewCustomer'
    ) as HTMLButtonElement;
    createNewCustomerEl.click();
  }

  customerAdded($event) {
    this.createCustomerEnable = false;
    this.toastrService.success('Customer Has been added ');
    this.fetchCustomerEventEmitter.emit($event);
    this.destroySelectCompEmitter.emit(true);
  }

  destroyCreateCustomerComp($event: boolean) {
    if ($event === true) {
      this.createCustomerEnable = false;
      this.showableALertPopup = true;
    }
    this.destroySelectCompEmitter.emit(true);
  }
}
