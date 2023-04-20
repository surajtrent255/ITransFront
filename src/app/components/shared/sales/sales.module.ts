import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSalesComponent } from './create-sales/create-sales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesBillingComponent } from './sales-billing/sales-billing.component';
import { SalesBillInvoiceComponent } from './sales-bill-invoice/sales-bill-invoice.component';
import { SalesBillEditComponent } from './sales-bill-edit/sales-bill-edit.component';
import { NumberToWordTransformPipe } from 'src/app/custompipes/number-to-word-transform.pipe';
import { PopupComponent } from 'src/app/popup/popup.component';
import { RouterModule } from '@angular/router';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectAndCreateCompanyComponent } from '../select-and-create-company/select-and-create-company.component';
import { SearchCreateProductsComponent } from '../search-create-products/search-create-products.component';



@NgModule({
  declarations: [
    CreateSalesComponent,
    SalesBillingComponent,
    SalesBillInvoiceComponent,
    SalesBillEditComponent,
    NumberToWordTransformPipe,
    PopupComponent,
    CreateCustomerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule,


  ],
  exports: [
    CreateSalesComponent,
    CreateCustomerComponent,
    SalesBillingComponent
  ],
})
export class SalesModule { }
