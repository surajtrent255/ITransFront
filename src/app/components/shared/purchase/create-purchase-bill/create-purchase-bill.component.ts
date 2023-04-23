import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/Product';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillDetail } from 'src/app/models/PurchaseBillDetail';
import { PurchaseBillMaster } from 'src/app/models/PurchaseBillMaster';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { Company } from 'src/app/models/company';
import { ProductService } from 'src/app/service/product.service';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';

@Component({
  selector: 'app-create-purchase-bill',
  templateUrl: './create-purchase-bill.component.html',
  styleUrls: ['./create-purchase-bill.component.css'],
})
export class CreatePurchaseBillComponent {
  billNo: number = 0;
  sellerId: number | undefined = 0;
  sellerName !: string;
  sellerPan !: number;
  sellerPanOrPhone!: number;
  selectMenusForCompanies!: Company[];
  selectMenusForCompaniesSize !: number;

  currentBranch!: string;
  date!: string;
  productBarCodeId: undefined | number;
  sellerSearchMethod: number = 1;

  companyId!: number;
  branchId !: number;
  productsUserWantToPurchase: Product[] = [];
  purchaseBillDetailInfos: PurchaseBillDetail[] = [];

  constructor(
    private salesCartService: SalesCartService,
    private productService: ProductService,
    private purchaseBillService: PurchaseBillService,
    private router: Router,
    private loginService: LoginService,
    private tostrService: ToastrService,
    private companyService: CompanyServiceService
  ) {
    const currentDateObj = new Date();
    const datePipe = new DatePipe('en-US');
    this.date = datePipe.transform(currentDateObj, 'yyyy-MM-dd')!;
  }

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.currentBranch = 'Branch ' + this.branchId;

  }
  addTheProductForPurchase() {
    if (this.productBarCodeId === undefined) {
      return;
    }
    this.productService
      .getProductById(this.productBarCodeId, this.companyId, this.branchId)
      .subscribe((data) => {
        if (data.data !== null) {
          this.productsUserWantToPurchase.push(data.data);
          this.productBarCodeId = undefined;
        }
      });
  }

  getCompanyList() {
    this.companyService.getAllCompanies().subscribe({
      next: (data) => {
        this.selectMenusForCompanies = data.data;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => { },
    });
  }

  sellerSearch(id: number) {
    this.sellerSearchMethod = id;
  }

  updateProdQtyUserWantToPurchase($event: any, prod: Product) {
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

  setSellerInfo(compId: number) {
    let comp: Company = this.selectMenusForCompanies.find(
      (comp) => Number(comp.companyId) === Number(compId)
    )!;
    this.sellerId = comp.companyId;
    this.sellerName = comp.name;
    this.sellerPan = Number(comp.panNo);
    const closePurchaserPopUpEl = document.getElementById(
      'closePurchaserPopup'
    ) as HTMLAnchorElement;
    closePurchaserPopUpEl.click();
  }


  fetchPurchaserInfo() {
    if (this.sellerPanOrPhone === null || this.sellerPanOrPhone === undefined) {
      this.tostrService.error(`pan or phone`, 'invalid number');
      return;
      // return;
    }


    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.sellerSearchMethod,
        this.sellerPanOrPhone
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;
        },
        complete: () => {
          const custBtn = document.getElementById(
            'selectPurchaser'
          ) as HTMLButtonElement;
          custBtn.click();
        },
      });
  }

  removeItemFromCart(id: number) {
    this.productsUserWantToPurchase = this.productsUserWantToPurchase.filter(
      (prod) => prod.id !== id
    );
  }


  purchaseTheProducts(draftSt: boolean) {
    console.log('above');

    if (
      this.billNo === 0 ||
      this.billNo === undefined ||
      this.productsUserWantToPurchase.length <= 0 ||
      this.sellerId === 0 ||
      this.sellerId === undefined
    ) {
      this.tostrService.error("please fill all the fields")
      return;
    }

    console.log('below');
    this.productsUserWantToPurchase.forEach((prod) => {
      let purchaseBillDetail: PurchaseBillDetail = new PurchaseBillDetail();
      purchaseBillDetail.productId = prod.id;
      let qtyElement = document.getElementById(
        'qtyProd' + prod.id
      ) as HTMLInputElement;
      purchaseBillDetail.qty = Number(qtyElement.value);
      purchaseBillDetail.discountPerUnit = prod.discount;
      purchaseBillDetail.rate = prod.sellingPrice;
      this.purchaseBillDetailInfos.push(purchaseBillDetail);
    });
    this.continueSelling();
  }

  continueSelling() {
    let amount = 0;
    let discount = 0;
    if (this.purchaseBillDetailInfos.length > 0) {
      for (let i = 0; i < this.purchaseBillDetailInfos.length; i++) {
        let prod = this.purchaseBillDetailInfos[i];
        amount += prod.qty * prod.rate;
        discount += prod.qty * prod.discountPerUnit;
      }
    }
    let taxableAmount = amount - discount;
    let taxAmount = (13 / 100) * taxableAmount;
    let totalAmount = taxableAmount + taxAmount;

    let purchaseBill: PurchaseBill = new PurchaseBill();
    let purchaseBillMaster: PurchaseBillMaster = new PurchaseBillMaster();
    purchaseBill.amount = amount;
    purchaseBill.discount = discount;
    purchaseBill.taxableAmount = taxableAmount;
    purchaseBill.taxAmount = taxAmount;
    purchaseBill.totalAmount = totalAmount;
    purchaseBill.companyId = this.companyId;
    purchaseBill.sellerId = this.sellerId!;
    purchaseBill.sellerName = this.sellerName;
    purchaseBill.sellerPan = this.sellerPan;
    purchaseBill.syncWithIrd = false;
    purchaseBill.enteredBy = this.loginService.currentUser.user.email;
    purchaseBill.paymentMethod = 'CashInHand';
    purchaseBill.purchaseBillNo = this.billNo;
    purchaseBill.userId = this.loginService.currentUser.user.id;
    purchaseBill.companyId = this.companyId;
    purchaseBill.branchId = this.branchId;
    purchaseBill.realTime = true;
    purchaseBill.billActive = true;
    purchaseBillMaster.purchaseBillDTO = purchaseBill;
    purchaseBillMaster.purchaseBillDetails = this.purchaseBillDetailInfos;

    console.log(purchaseBillMaster);
    this.purchaseBillService
      .createNewPurchaseBill(purchaseBillMaster)
      .subscribe({
        next: (data) => {
          console.log(data.data);
          this.router.navigateByUrl(
            `dashboard/purchasebills`
          );
        },
        error: (error) => {
          console.log(error.error.description);
        },
      });
  }

  createNewProduct($event: any) { }
}

interface InputEvent extends Event {
  target: HTMLInputElement;
  key: string;
}
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector<HTMLInputElement>('.input-field input');
  if (input) {
    input.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
      }
    });
  } else {
    console.log('Element not found!');
  }
});
