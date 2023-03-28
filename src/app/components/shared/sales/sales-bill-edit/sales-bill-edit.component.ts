import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sales-bill-edit',
  templateUrl: './sales-bill-edit.component.html',
  styleUrls: ['./sales-bill-edit.component.css']
})
export class SalesBillEditComponent {

  @Output() activeSalesBillEditEvent = new EventEmitter<boolean>();

  deactivateSalesBillEdit() {
    this.activeSalesBillEditEvent.emit(false);
  }

  ngOnInit() {
    console.log("salesBillEdit ===  init ")
  }
  ngOnDestroy() {
    console.log("destorying sales-bill-edit component")
  }
}
