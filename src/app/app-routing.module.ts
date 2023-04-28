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
import { CreatePurchaseBillComponent } from './components/shared/purchase/create-purchase-bill/create-purchase-bill.component';
import { StockComponent } from './components/shared/stock/stock.component';
import { PaymentComponent } from './components/shared/payment/payment.component';
import { ReceiptComponent } from './components/shared/receipt/receipt.component';
import { CreateBankComponent } from './components/shared/bank/create-bank/create-bank.component';
import { BankDepositComponent } from './components/shared/bank/bank-deposit/bank-deposit.component';
import { BankWithdrawComponent } from './components/shared/bank/bank-withdraw/bank-withdraw.component';
import { ExpenseComponent } from './components/shared/expense/expense.component';
import { FixedAsstetsComponent } from './components/shared/fixed-asstets/fixed-asstets.component';

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
        path: 'salesbill/:billId',
        component: SalesBillEditComponent,
      },
      {
        path: 'salesbill/invoice/:billId',
        component: SalesBillInvoiceComponent,
      },
      {
        path: 'categoryprod',
        component: CategoryprodComponent,
      },
      {
        path: 'purchase/create',
        component: CreatePurchaseBillComponent,
      },
      {
        path: ':id/purchasebills',
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
      {
        path: 'demo',
        component: DemoComponent,
      },
      {
        path: ':id/stock',
        component: StockComponent,
      },
      {
        path: 'payment',
        component: PaymentComponent,
      },
      {
        path: 'receipt',
        component: ReceiptComponent,
      },
      {
        path: 'create/bank',
        component: CreateBankComponent,
      },
      {
        path: 'bank/deposit',
        component: BankDepositComponent,
      },
      {
        path: 'bank/withdraw',
        component: BankWithdrawComponent,
      },
      {
        path: 'expense',
        component: ExpenseComponent,
      },
      {
        path: 'fixedAsset',
        component: FixedAsstetsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
