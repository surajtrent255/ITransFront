import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import { User } from 'src/app/models/user';
import { ProductService } from 'src/app/service/product.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-sales',
  templateUrl: './create-sales.component.html',
  styleUrls: ['./create-sales.component.css'],
})
export class CreateSalesComponent {
  @Output() salesBillDetailListEvent = new EventEmitter<SalesBillDetail[]>();
  @Output() activeSalesBillEntryEvent = new EventEmitter<boolean>();

  @Output() customerIdEntryEvent = new EventEmitter<number>();
  salesBillDetail: SalesBillDetail = new SalesBillDetail();
  salesBillDetailInfos: SalesBillDetail[] = [];

  salesBillDetailsForCart: SalesBillDetail[] = [];

  productBarCodeId: undefined | number;
  productsUserWantTosale: Product[] = [];
  productQtyUserWantTOSale: number = 1;
  customerId!: number;

  // isconfirmAlert: boolean = false;
  // alertboxshowable: boolean = true;

  constructor(
    private salesCartService: SalesCartService,
    private productService: ProductService,
    private salesBillService: SalesBillServiceService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  // deactiveCreateSalesComp() {
  //   this.activeSalesBillEntryEvent.emit(false)
  // }

  addTheProductForSale() {
    if (this.productBarCodeId === undefined) {
      return;
    }
    this.productService
      .getProductById(this.productBarCodeId)
      .subscribe((data) => {
        console.log(data.data);
        console.log('navin');
        if (data.data !== null) {
          this.productsUserWantTosale.push(data.data);
          this.productBarCodeId = undefined;
        }
      });
  }

  updateProdQtyUserWantToSale($event: any, prod: Product) {
    if ($event.target.value === undefined) {
      return;
    }
    let qtyProd = $event.target.value;
    const prodtotalAmountElement = document.getElementById(
      'totalAmount' + prod.id
    ) as HTMLElement;
    let prodTotalAmount = Number(qtyProd) * prod.sellingPrice;
    prodtotalAmountElement.innerText = '' + prodTotalAmount;
  }

  saleTheProducts() {
    if (
      this.customerId === 0 ||
      this.customerId === undefined ||
      this.productsUserWantTosale.length <= 0
    )
      return;
    const hidePopperBtn = document.getElementById(
      'closeAlertPopperButton'
    ) as HTMLButtonElement;
    // hidePopperBtn.click();
    // this.customerIdEntryEvent.emit(this.customerId)
    this.productsUserWantTosale.forEach((prod) => {
      let saleBillDetail: SalesBillDetail = new SalesBillDetail();
      saleBillDetail.productId = prod.id;
      let qtyElement = document.getElementById(
        'qtyProd' + prod.id
      ) as HTMLInputElement;
      saleBillDetail.qty = Number(qtyElement.value);
      saleBillDetail.discountPerUnit = prod.discount;
      saleBillDetail.rate = prod.sellingPrice;
      this.salesBillDetailInfos.push(saleBillDetail);
    });
    this.continueSelling();
  }

  continueSelling() {
    let salesBillDetailInfos = this.salesBillDetailInfos;
    let amount = 0;
    let discount = 0;
    if (salesBillDetailInfos.length > 0) {
      for (let i = 0; i < salesBillDetailInfos.length; i++) {
        let prod = salesBillDetailInfos[i];
        amount += prod.qty * prod.rate;
        discount += prod.qty * prod.discountPerUnit;
      }
    }
    let taxableAmount = amount - discount;
    let taxAmount = (13 / 100) * taxableAmount;
    let totalAmount = taxableAmount + taxAmount;

    let salesBill: SalesBill = new SalesBill();
    let salesBillMaster: SalesBillMaster = new SalesBillMaster();
    salesBill.amount = amount;
    salesBill.discount = discount;
    salesBill.taxableAmount = taxableAmount;
    salesBill.taxAmount = taxAmount;
    salesBill.totalAmount = totalAmount;
    salesBill.customerId = this.customerId;
    salesBill.customerName = 'xyz mohit';
    salesBill.customerPan = 'Pan#123';
    salesBill.syncWithIrd = false;
    salesBill.enteredBy = this.loginService.currentUser.user.email;
    salesBill.paymentMethod = 'CashInHand';

    salesBill.userId = this.loginService.currentUser.user.id;
    salesBill.companyId = this.loginService.getCompnayId();
    salesBill.realTime = true;
    salesBill.billActive = true;

    salesBillMaster.salesBillDTO = salesBill;
    salesBillMaster.salesBillDetails = salesBillDetailInfos;
    console.log(salesBillMaster);
    this.salesBillService.createNewSalesBill(salesBillMaster).subscribe({
      next: (data) => {
        this.router.navigateByUrl(
          `dashboard/salesbill/invoice/${data.data}/${salesBill.companyId}`
        );
      },
    });
  }
}
