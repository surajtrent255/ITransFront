import { DatePipe } from '@angular/common';
import { identifierName } from '@angular/compiler';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/Product';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillDetail } from 'src/app/models/PurchaseBillDetail';
import { PurchaseBillMaster } from 'src/app/models/PurchaseBillMaster';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { UserFeature } from 'src/app/models/UserFeatures';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
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
  @ViewChild('createtransportationForm') createtransportationForm!: NgForm;
  @ViewChild('loading', { static: false }) loadingInput!: ElementRef;
  @ViewChild('transportationTax', { static: false })
  transportationTaxInput!: ElementRef;
  @ViewChild('insuranceTax', { static: false }) insuranceTaxInput!: ElementRef;
  @ViewChild('loadingTax', { static: false }) loadingTaxInput!: ElementRef;
  @ViewChild('otherTax', { static: false }) otherTaxInput!: ElementRef;
  @ViewChild('submit_btn', { static: false }) buttonInput!: ElementRef;
  @ViewChild('prodIdInput', { static: false }) prodIdInput!: ElementRef;
  @ViewChild('#insuranceField', { static: false }) insuranceInput!: ElementRef;
  @ViewChild('other', { static: false }) otherInput!: ElementRef;
  selectSenderActive: boolean = false;

  billNo: number = 0;
  sellerId: number | undefined = 0;
  sellerName!: string;
  sellerPan!: number;
  sellerAddress!: string;
  sellerPanOrPhone!: number;
  selectMenusForCompanies!: Company[];
  selectMenusForCompaniesSize!: number;
  saleType: number = 1;
  currentBranch!: string;
  date!: string;
  productBarCodeId: undefined | number;
  sellerSearchMethod: number = 1;
  selectMenusForProduct: Product[] = [];

  companyId!: number;
  branchId!: number;
  productsUserWantToPurchase: Product[] = [];
  purchaseBillDetailInfos: PurchaseBillDetail[] = [];
  formpurchaseBill: PurchaseBill[] = [];
  typerate: VatRateTypes[] = [];
  featureObjs: UserFeature[] = [];
  searchByBarCode: boolean = false;
  selectProductActive: boolean = false;
  transportation: number = 0.0;
  insurance: number = 0.0;
  loading: number = 0.0;
  other: number = 0.0;
  taxTypeId!: number;
  transportationTaxType: number = 3;
  insuranceTaxType: number = 3;
  loadingTaxType: number = 3;
  otherTaxType: number = 3;

  prodWildCard!: string;

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
    this.featureObjs = this.loginService.getFeatureObjs();

    this.getAllVatRateTypes();
    this.featureObjs.forEach((fo) => {
      if (fo.featureId === 2) {
        this.searchByBarCode = true;
      }
    });
    this.currentBranch = 'Branch ' + this.branchId;
  }

  ngAfterViewInit() {
    const productBarCodeIdEL = document.getElementById(
      'productBarCodeId'
    ) as HTMLButtonElement;
    productBarCodeIdEL.focus();
  }

  addTheProductForPurchase() {
    if (this.productBarCodeId === undefined) {
      return;
    }
    this.productService
      .getProductById(
        this.productBarCodeId,
        this.companyId,
        this.branchId,
        this.searchByBarCode
      )
      .subscribe((data) => {
        if (data.data !== null) {
          this.productsUserWantToPurchase.push(data.data);
          this.productBarCodeId = undefined;
        } else if (data.data === null) {
          this.tostrService.error('product not available');
        }
      });
  }
  getAllVatRateTypes() {
    this.productService.getAllVatRateTypes().subscribe((res) => {
      console.log(res.data);
      this.typerate = res.data;
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
      complete: () => {},
    });
  }

  sellerSearch(id: number) {
    this.sellerSearchMethod = id;
  }

  updateProdQtyUserWantToPurchase($event: any, prodIndex: number) {
    if ($event.target.value === undefined) {
      return;
    }

    let qtyProd = $event.target.value;
    const prodtotalAmountElement = document.getElementById(
      'totalAmount' + prodIndex
    ) as HTMLElement;

    const unitPriceEl = document.getElementById(
      'unitPrice' + prodIndex
    ) as HTMLInputElement;
    let sp: number = Number(unitPriceEl.value);
    let prodTotalAmount = Number(qtyProd) * sp;
    prodtotalAmountElement.innerText = '' + prodTotalAmount;
  }

  setSellerInfo(compId: number) {
    let comp: Company = this.selectMenusForCompanies.find(
      (comp) => Number(comp.companyId) === Number(compId)
    )!;
    this.sellerId = comp.companyId;
    this.sellerName = comp.name;
    this.sellerPan = Number(comp.panNo);
    this.sellerAddress = comp.munVdc + comp.wardNo;
    this.destroySelectSenderComponent(true);
  }
  getNameWildCard() {
    setTimeout(() => {
      this.selectProductActive = true;
    }, 200);
    const selectProductBtn = document.getElementById(
      'selectProduct'
    ) as HTMLButtonElement;
    selectProductBtn.click();
    this.productService
      .getProductByWildCardName(
        this.prodWildCard,
        this.companyId,
        this.branchId
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForProduct = data.data;
        },
      });
  }

  setProductSelectedByName(prodId: number) {
    this.productBarCodeId = prodId;
    this.prodIdInput.nativeElement.focus();
    this.selectProductActive = false;
  }

  fetchPurchaserInfo() {
    if (this.sellerPanOrPhone === null || this.sellerPanOrPhone === undefined) {
      this.tostrService.error(`pan or phone`, 'invalid number');
      return;
      // return;
    }
    setTimeout(() => {
      this.selectSenderActive = true;
    }, 400);
    const selectSellerBtn = document.getElementById(
      'selectSeller'
    ) as HTMLButtonElement;
    selectSellerBtn.click();

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
      (prod, index) => index !== id
    );
  }

  setSaleType(id: number) {
    this.saleType = id;
  }
  goTopurchesebuttom() {
    const insurancefiledEl = document.getElementById(
      'submit_btn'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToOtherTaxField() {
    const insurancefiledEl = document.getElementById(
      'otherTaxType'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToOtherField() {
    const insurancefiledEl = document.getElementById(
      'other'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToLoadingTaxField() {
    const insurancefiledEl = document.getElementById(
      'loadingTax'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToLoadingField() {
    const insurancefiledEl = document.getElementById(
      'loading'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToInsuranceTaxField() {
    const insurancefiledEl = document.getElementById(
      'insuranceTax'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToInsuranceField() {
    const insurancefiledEl = document.getElementById(
      'insurance'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToTransportationTaxField() {
    const insurancefiledEl = document.getElementById(
      'transportationTax'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }

  destroySelectSenderComponent($event: boolean) {
    this.selectSenderActive = false;
  }

  destroySelectProductComponent($event: boolean) {
    this.selectProductActive = false;
  }

  fetchSellerInfoOnlyForNameDisplay($event: number) {
    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.sellerSearchMethod,
        this.sellerPanOrPhone
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;
          this.setSellerInfo($event);
        },
      });
  }

  purchaseTheProducts(draftSt: boolean) {
    console.log('above');
    if (this.createtransportationForm.invalid) {
      this.tostrService.error('please fill all the charges fields');
      return;
    }
    if (
      this.billNo === 0 ||
      this.billNo === undefined ||
      this.productsUserWantToPurchase.length <= 0 ||
      this.sellerId === 0 ||
      this.sellerId === undefined
    ) {
      this.tostrService.error('please fill all the fields');
      return;
    }

    console.log('below');
    this.productsUserWantToPurchase.forEach((prod, index) => {
      let purchaseBillDetail: PurchaseBillDetail = new PurchaseBillDetail();
      purchaseBillDetail.productId = prod.id;
      purchaseBillDetail.taxTypeId = prod.tax;
      let qtyElement = document.getElementById(
        'qtyProd' + index
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
    purchaseBill.saleType = this.saleType;
    purchaseBill.amount = amount;
    purchaseBill.discount = discount;
    purchaseBill.taxableAmount = taxableAmount;
    purchaseBill.taxAmount = taxAmount;
    purchaseBill.totalAmount = totalAmount;
    purchaseBill.companyId = this.companyId;
    purchaseBill.sellerId = this.sellerId!;
    purchaseBill.sellerName = this.sellerName;
    purchaseBill.sellerPan = this.sellerPan;
    purchaseBill.sellerAddress = this.sellerAddress;
    purchaseBill.syncWithIrd = false;
    purchaseBill.enteredBy = this.loginService.currentUser.user.email;
    purchaseBill.paymentMethod = 'CashInHand';
    purchaseBill.purchaseBillNo = this.billNo;
    purchaseBill.userId = this.loginService.currentUser.user.id;
    purchaseBill.companyId = this.companyId;
    purchaseBill.branchId = this.branchId;
    purchaseBill.realTime = true;
    purchaseBill.billActive = true;

    purchaseBill.transportation = this.transportation;
    purchaseBill.transportationTaxType = this.transportationTaxType;

    purchaseBill.insurance = this.insurance;
    purchaseBill.insuranceTaxType = this.insuranceTaxType;
    purchaseBill.loading = this.loading;
    purchaseBill.loadingTaxType = this.loadingTaxType;
    purchaseBill.other = this.other;
    purchaseBill.otherTaxType = this.otherTaxType;
    purchaseBillMaster.purchaseBillDTO = purchaseBill;
    purchaseBillMaster.purchaseBillDetails = this.purchaseBillDetailInfos;

    console.log(purchaseBillMaster);
    this.purchaseBillService
      .createNewPurchaseBill(purchaseBillMaster)
      .subscribe({
        next: (data) => {
          this.createtransportationForm.reset();
          console.log(data.data);
          this.router.navigateByUrl(`dashboard/purchasebills`);
        },
        error: (error) => {
          console.log(error.error.description);
        },
      });
  }

  createNewProduct($event: any) {}
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
