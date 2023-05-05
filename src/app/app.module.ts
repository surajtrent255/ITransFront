import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/shared/login/login.component';
import { DemoComponent } from './components/demo/demo/demo.component';

import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { GroupComboAndAttributeComponent } from './components/shared/group-combo-and-attribute/group-combo-and-attribute.component';
import { HierarchyComponent } from './components/shared/hierarchy/hierarchy.component';
import { TestingComponent } from './components/shared/testing/testing.component';
import { TabsComponent } from './components/shared/tabs/tabs.component';
import { PricingTypesAndSequenceComponent } from './components/shared/pricing-types-and-sequence/pricing-types-and-sequence.component';
import { SearchCreateProductsComponent } from './components/shared/search-create-products/search-create-products.component';
import { SelectAndCreateCompanyComponent } from './components/shared/select-and-create-company/select-and-create-company.component';
import { AuthInterceptor } from './auth/AuthInterceptor';
import { NumberToWordTransformPipe } from './custompipes/number-to-word-transform.pipe';
import { PopupComponent } from './popup/popup.component';
import { CategoryprodComponent } from './components/shared/categoryprod/categoryprod.component';
import { PurchaseComponent } from './components/shared/purchase/purchase.component';
import { ProductComponent } from './components/shared/product/product.component';
import { CreateProductComponent } from './components/shared/product/create-product/create-product.component';
import { EditproductComponent } from './components/shared/product/editproduct/editproduct.component';
import { CreatecategoryComponent } from './components/shared/categoryprod/createcategory/createcategory.component';
import { CreatePurchaseBillComponent } from './components/shared/purchase/create-purchase-bill/create-purchase-bill.component';
import { StockComponent } from './components/shared/stock/stock.component';
import { CreateSalesComponent } from './components/shared/sales/create-sales/create-sales.component';
import { SalesBillingComponent } from './components/shared/sales/sales-billing/sales-billing.component';
import { SalesBillInvoiceComponent } from './components/shared/sales/sales-bill-invoice/sales-bill-invoice.component';
import { SalesBillEditComponent } from './components/shared/sales/sales-bill-edit/sales-bill-edit.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateCustomerComponent } from './components/shared/sales/create-customer/create-customer.component';
import { SelectCustomerComponent } from './components/shared/select-customer/select-customer.component';
import { CreateCompanyComponent } from './components/shared/select-and-create-company/create-company/create-company.component';
import { PaymentComponent } from './components/shared/payment/payment.component';
import { ReceiptComponent } from './components/shared/receipt/receipt.component';
import { CreateBankComponent } from './components/shared/bank/create-bank/create-bank.component';
import { BankDepositComponent } from './components/shared/bank/bank-deposit/bank-deposit.component';
import { BankWithdrawComponent } from './components/shared/bank/bank-withdraw/bank-withdraw.component';
import { EditPaymentDetailsComponent } from './components/shared/payment/edit-payment-details/edit-payment-details.component';
import { ExpenseComponent } from './components/shared/expense/expense.component';
import { FixedAsstetsComponent } from './components/shared/fixed-asstets/fixed-asstets.component';
import { EditExpenseComponent } from './components/shared/expense/edit-expense/edit-expense.component';
import { EditFixedAssetsComponent } from './components/shared/fixed-asstets/edit-fixed-assets/edit-fixed-assets.component';
import { PurchaseBillDetail } from './models/PurchaseBillDetail';
import { PurchaseBillDetailComponent } from './components/shared/purchase/purchase-bill-detail/purchase-bill-detail.component';
import { SelectCategoryComponent } from './components/shared/categoryprod/select-category/select-category.component';
import { LoanComponent } from './components/shared/loan/loan.component';
import { CreateLoanComponent } from './components/shared/loan/create-loan/create-loan.component';
import { EditLoanComponent } from './components/shared/loan/edit-loan/edit-loan.component';
import { SelectProductComponent } from './components/shared/select-product/select-product.component';
import { SplitProductComponent } from './components/shared/split-product/split-product.component';
import { MergeProductComponent } from './components/shared/merge-product/merge-product.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CreateSplitProductComponent } from './components/shared/split-product/create-split-product/create-split-product.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DemoComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    GroupComboAndAttributeComponent,
    HierarchyComponent,
    TestingComponent,
    TabsComponent,
    PricingTypesAndSequenceComponent,
    SearchCreateProductsComponent,
    SelectAndCreateCompanyComponent,
    CategoryprodComponent,
    PurchaseComponent,
    ProductComponent,
    CreateProductComponent,
    EditproductComponent,
    CreatecategoryComponent,
    CreatePurchaseBillComponent,
    StockComponent,
    CreateSalesComponent,
    SalesBillingComponent,
    SalesBillInvoiceComponent,
    SalesBillEditComponent,
    NumberToWordTransformPipe,
    PopupComponent,
    CreateCustomerComponent,
    SelectCustomerComponent,
    CreateCompanyComponent,
    PaymentComponent,
    ReceiptComponent,
    CreateBankComponent,
    BankDepositComponent,
    BankWithdrawComponent,
    EditPaymentDetailsComponent,
    ExpenseComponent,
    FixedAsstetsComponent,
    EditExpenseComponent,
    EditFixedAssetsComponent,
    PurchaseBillDetailComponent,
    SelectCategoryComponent,
    LoanComponent,
    CreateLoanComponent,
    EditLoanComponent,
    SelectProductComponent,
    SplitProductComponent,
    MergeProductComponent,
    CreateSplitProductComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF_DEFAULT_COOKIE_NAME',
      headerName: 'XSRF_DEFAULT_HEADER_NAME',
    }),
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      newestOnTop: false,
    }),

    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ProductComponent],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
