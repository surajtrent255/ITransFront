import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import Swal from 'sweetalert2';
import { NumberToWordTransformPipe } from 'src/app/custompipes/number-to-word-transform.pipe';
@Component({
  selector: 'app-sales-bill-invoice',
  templateUrl: './sales-bill-invoice.component.html',
  styleUrls: ['./sales-bill-invoice.component.css']
})
export class SalesBillInvoiceComponent {

  @Input()
  salesInvoice: SalesBillInvoice = new SalesBillInvoice;

  @Output() billNoEvent = new EventEmitter<number>();

  @Output() activeSalesBillInvoiceEvent = new EventEmitter<boolean>();

  ngOnInit() {
    this.salesInvoice.salesBillDTO.totalAmount = Math.floor(this.salesInvoice.salesBillDTO.totalAmount);
    console.log("salebill init");
  }

  printTheBill(billNo: number) {
    Swal.fire({
      text: 'loading...',
      showCancelButton: false,
      showConfirmButton: false
    })
    console.log("bill no = " + billNo)
    this.billNoEvent.emit(billNo);
  }

  deactivateSalesBillInvoice() {
    this.activeSalesBillInvoiceEvent.emit(false);
  }

  ngOnDestroy() {
    console.log("destorying sales-bill-invoice component")
  }

}
