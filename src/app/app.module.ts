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
import { RegisterComponent } from './components/shared/register/register.component';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { GroupComboAndAttributeComponent } from './components/shared/group-combo-and-attribute/group-combo-and-attribute.component';
import { HierarchyComponent } from './components/shared/hierarchy/hierarchy.component';
import { TestingComponent } from './components/shared/testing/testing.component';
import { TabsComponent } from './components/shared/tabs/tabs.component';
import { PricingTypesAndSequenceComponent } from './components/shared/pricing-types-and-sequence/pricing-types-and-sequence.component';
import { SearchCreateProductsComponent } from './components/shared/search-create-products/search-create-products.component';
import { AuthInterceptor } from './auth/AuthInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DemoComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    GroupComboAndAttributeComponent,
    HierarchyComponent,
    TestingComponent,
    TabsComponent,
    PricingTypesAndSequenceComponent,
    SearchCreateProductsComponent,
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
