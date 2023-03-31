import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './components/demo/demo/demo.component';
import { CategoryprodComponent } from './components/shared/categoryprod/categoryprod.component';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { LoginComponent } from './components/shared/login/login.component';
import { SelectAndCreateCompanyComponent } from './components/shared/select-and-create-company/select-and-create-company.component';
import { EditproductComponent } from './components/shared/product/editproduct/editproduct.component';
import { ProductComponent } from './components/shared/product/product.component';
import { PurchaseComponent } from './components/shared/purchase/purchase.component';
import { CreateSalesComponent } from './components/shared/sales/create-sales/create-sales.component';
import { SalesBillEditComponent } from './components/shared/sales/sales-bill-edit/sales-bill-edit.component';
import { SalesBillInvoiceComponent } from './components/shared/sales/sales-bill-invoice/sales-bill-invoice.component';
import { SalesBillingComponent } from './components/shared/sales/sales-billing/sales-billing.component';
import { CategoryProduct } from './models/CategoryProduct';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'demo',
    component: DemoComponent,
  },

  {
    path: 'company',
    component: SelectAndCreateCompanyComponent,
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'salesbill',
        component: SalesBillingComponent,
      },
      {
        path: 'salesbill/create',
        component: CreateSalesComponent,
      },
      {
        path: 'salesbill/:billNo',
        component: SalesBillEditComponent,
      },
      {
        path: 'salesbill/invoice/:billNo/:companyId',
        component: SalesBillInvoiceComponent,
      },
      {
        path: 'categoryprod',
        component: CategoryprodComponent,
      },
      {
        path: 'purchase',
        component: PurchaseComponent,
      },
      {
        path: 'products',
        component: ProductComponent,
      },
      {
        path: 'products/edit/:prodId',
        component: EditproductComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
