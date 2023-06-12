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
import { SuperAdminComponent } from './components/shared/super-admin/super-admin.component';
import { CreateCounterComponent } from './components/shared/header/create-counter/create-counter/create-counter.component';
import { AssignCounterComponent } from './components/shared/header/assign-counter/assign-counter.component';
import { CounterUserListComponent } from './components/shared/header/counter-user-list/counter-user-list.component';
import { AssignFeatureComponent } from './components/shared/header/feature-control/assign-feature/assign-feature.component';
import { UserFeatureListComponent } from './components/shared/header/feature-control/user-feature-list/user-feature-list.component';
import { SearchPipe } from './components/shared/split-product/search.pipe';
import { SearchProductComponent } from './components/shared/search-product/search-product.component';
import { DebitNoteComponent } from './components/shared/debit-note/debit-note.component';
import { CreditNoteComponent } from './components/shared/credit-note/credit-note.component';
import { DebitNoteInvoiceComponent } from './components/shared/debit-note/debit-note-invoice/debit-note-invoice.component';
import { CreditNoteInvoiceComponent } from './components/shared/credit-note/credit-note-invoice/credit-note-invoice.component';
import { CreditNoteListComponent } from './components/shared/credit-note/credit-note-list/credit-note-list.component';
import { DebitNoteListComponent } from './components/shared/debit-note/debit-note-list/debit-note-list.component';
import { ConfirmAlertComponent } from './components/shared/confirm-alert/confirm-alert.component';
import { CreditNoteInvoicePrintComponent } from './components/shared/credit-note/credit-note-invoice-print/credit-note-invoice-print.component';
import { DebitNoteInvoicePrintComponent } from './components/shared/debit-note/debit-note-invoice-print/debit-note-invoice-print.component';
import { RoundingPipe } from './custompipes/RoundingPipe';
import { DebitNoteReportComponent } from './components/shared/debit-note/debit-note-report/debit-note-report.component';
import { PurchaseReportComponent } from './components/shared/purchase/purchase-report/purchase-report.component';
import { SalesReportComponent } from './components/shared/sales/sales-report/sales-report.component';
import { SalesReportDetailComponent } from './components/shared/sales/sales-report/sales-report-detail/sales-report-detail.component';
import { PurchaseReportDetailComponent } from './components/shared/purchase/purchase-report/purchase-report-detail/purchase-report-detail.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CompanyLabelComponent } from './components/shared/header/company-label/company-label.component';
import { EditProfileCompanyInfoComponent } from './components/shared/header/edit-profile-company-info/edit-profile-company-info.component';
import { DynamicFormComponent } from './components/shared/purchase/create-purchase-bill/dynamic-form/dynamic-form.component';

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
    RoundingPipe,
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
    SuperAdminComponent,
    CreateCounterComponent,
    AssignCounterComponent,
    CounterUserListComponent,
    AssignFeatureComponent,
    UserFeatureListComponent,
    SearchPipe,
    SearchProductComponent,
    DebitNoteComponent,
    CreditNoteComponent,
    DebitNoteInvoiceComponent,
    CreditNoteInvoiceComponent,
    CreditNoteListComponent,
    DebitNoteListComponent,
    ConfirmAlertComponent,
    CreditNoteInvoicePrintComponent,
    DebitNoteInvoicePrintComponent,
    DebitNoteReportComponent,
    PurchaseReportComponent,
    SalesReportComponent,
    SalesReportDetailComponent,
    PurchaseReportDetailComponent,
    CompanyLabelComponent,
    EditProfileCompanyInfoComponent,
    DynamicFormComponent,
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
    DragDropModule,
    OverlayModule,
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
export class AppModule {}
