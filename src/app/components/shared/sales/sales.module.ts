import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSalesComponent } from './create-sales/create-sales.component';
import { FormsModule } from '@angular/forms';
import { SalesBillingComponent } from './sales-billing/sales-billing.component';
import { SalesBillInvoiceComponent } from './sales-bill-invoice/sales-bill-invoice.component';
import { SalesBillEditComponent } from './sales-bill-edit/sales-bill-edit.component';
import { NumberToWordTransformPipe } from 'src/app/custompipes/number-to-word-transform.pipe';
import { PopupComponent } from 'src/app/popup/popup.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CreateSalesComponent,
    SalesBillingComponent,
    SalesBillInvoiceComponent,
    SalesBillEditComponent,
    NumberToWordTransformPipe,
    PopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule

  ],
  exports: [
    CreateSalesComponent,
    SalesBillingComponent
  ],
})
export class SalesModule { }
