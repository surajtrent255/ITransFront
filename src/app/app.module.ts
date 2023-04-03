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
import { SalesModule } from './components/shared/sales/sales.module';
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
  ],
  imports: [
    BrowserModule,
    SalesModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF_DEFAULT_COOKIE_NAME',
      headerName: 'XSRF_DEFAULT_HEADER_NAME',
    }),
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false,
    }),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
