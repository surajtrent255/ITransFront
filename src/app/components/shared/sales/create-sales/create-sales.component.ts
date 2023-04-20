import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { NgSelectModule } from '@ng-select/ng-select';

import { ProductService } from 'src/app/service/product.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';
import { VatRateTypesService } from 'src/app/service/shared/vat-rate-types.service';
import Swal from 'sweetalert2';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { RJResponse } from 'src/app/models/rjresponse';
import { SalesBillDetailWithProdInfo } from 'src/app/models/SalesBillDetailWithProdInfo';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';

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

  customerCompany!: Company;
  customerId!: number;
  customerName!: string;
  customerPan!: number;

  selectMenusForCompanies!: Company[];

  vatRateTypes: VatRateTypes[] = [];
  discountReadOnly: boolean = true;

  discountApproachSelect: number = 2;

  taxApproach: number = 1;

  currentBranch!: string;
  date!: string;
  // isconfirmAlert: boolean = false;
  // alertboxshowable: boolean = true;
  companyId!: number;
  branchId!: number;

  alreadyDraft: number = 0;
  selectedValueForTaxRateTypes: number = 3;
  taxApproachSelectEl: number = 2;
  customerSearchMethod: number = 1;
  custPhoneOrPan!: number;

  constructor(
    private salesCartService: SalesCartService,
    private productService: ProductService,
    private salesBillService: SalesBillServiceService,
    private router: Router,
    private loginService: LoginService,
    private companyService: CompanyServiceService,
    private vatRateTypeService: VatRateTypesService,
    private activatedRoute: ActivatedRoute,
    private tostrService: ToastrService
  ) {
    const currentDateObj = new Date();
    const datePipe = new DatePipe('en-US');
    this.date = datePipe.transform(currentDateObj, 'yyyy-MM-dd')!;
  }

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.currentBranch = 'Branch ' + this.branchId;
    let billId: number = this.activatedRoute.snapshot.queryParams['id'];
    if (billId > 0) {
      this.alreadyDraft = billId;
      this.fetchSalesBillDraftInvoice(billId);
    }
    this.getCompanyList();
    this.getVatRateTypes();
  }

  fetchSalesBillDraftInvoice(billId: number) {
    this.salesBillService.fetchSalesBillDetailForInvoice(billId).subscribe({
      next: (data: RJResponse<SalesBillInvoice>) => {
        // alert(data.data.salesBillDTO.draft);
        let salesBillInvoice: SalesBillInvoice = data.data;

        // this.date = data.data.salesBillDTO.billDate.toISOString().substring(0, 10);
        this.date = new Date(salesBillInvoice.salesBillDTO.billDate)
          .toISOString()
          .substring(0, 10);
        this.customerId = salesBillInvoice.salesBillDTO.customerId;
        this.taxApproachSelectEl = salesBillInvoice.salesBillDTO.taxApproach;
        this.customerSearchMethod =
          salesBillInvoice.salesBillDTO.customerSearchMethod;

        this.getDiscountMethod(salesBillInvoice.salesBillDTO.taxApproach);

        this.customerId = salesBillInvoice.salesBillDTO.customerId;
        this.customerName = salesBillInvoice.salesBillDTO.customerName;
        this.customerPan = salesBillInvoice.salesBillDTO.customerPan;

        let productsIds: number[] = [];
        salesBillInvoice.salesBillDetailsWithProd.forEach((prod) => {
          productsIds.push(prod.productId);
        });

        this.productService.getProductsByProductIds(productsIds).subscribe({
          next: (data) => {
            this.productsUserWantTosale = data.data;
            setTimeout(() => {
              this.manipulateDomItemsForDraft(
                salesBillInvoice.salesBillDetailsWithProd
              );
            });
          },
        });
      },
    });
  }

  manipulateDomItemsForDraft(
    salesBillDetailsWithProd: SalesBillDetailWithProdInfo[]
  ) {
    this.productsUserWantTosale.forEach((prod) => {
      const qtyEl = document.getElementById(
        `qtyProd${prod.id}`
      ) as HTMLInputElement;
      const discountEl = document.getElementById(
        `discountPerc${prod.id}`
      ) as HTMLInputElement;
      const totalAmountEl = document.getElementById(
        `totalAmount${prod.id}`
      ) as HTMLElement;

      let salesProd: SalesBillDetailWithProdInfo =
        salesBillDetailsWithProd.find((sp) => sp.productId === prod.id)!;
      this.selectedValueForTaxRateTypes = salesProd.taxRate;
      qtyEl.value = String(salesProd.qty);
      discountEl.value = String(salesProd.discountPerUnit);
      totalAmountEl.innerText = String(salesProd.rowTotal);
    });
  }

  customerSearch(id: number) {
    this.customerSearchMethod = id;
  }

  fetchCustomerInfo() {
    if (this.custPhoneOrPan === null || this.custPhoneOrPan === undefined) {
      this.tostrService.error(`pan or phone`, 'invalid number');
      return;
      // return;
    }

    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.customerSearchMethod,
        this.custPhoneOrPan
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
        },
        complete: () => {
          const custBtn = document.getElementById(
            'selectCustomer'
          ) as HTMLButtonElement;
          custBtn.click();
        },
      });
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item.label.toLowerCase().indexOf(term) > -1 ||
      item.value.toLowerCase().indexOf(term) > -1
    );
  }

  getVatRateTypes() {
    this.vatRateTypeService.getAllVatRateTypes().subscribe({
      next: (res) => {
        this.vatRateTypes = res.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setCustomerInfo(compId: number) {
    let comp: Company = this.selectMenusForCompanies.find(
      (comp) => Number(comp.companyId) === Number(compId)
    )!;
    this.customerId = comp.companyId;
    this.customerName = comp.name;
    this.customerPan = Number(comp.panNo);
    const closeCustomerPopUpEl = document.getElementById(
      'closeCustPop'
    ) as HTMLAnchorElement;
    closeCustomerPopUpEl.click();
  }

  getApproach($event: any) {
    console.log($event.target.value);
    this.taxApproach = Number($event.target.value);
    console.log(this.taxApproach);

    this.productsUserWantTosale.forEach((prod) => {
      this.updateTotalAmount(prod);
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

  getDiscountMethod(id: number) {
    if (id === 1) {
      this.discountApproachSelect = 1;
      this.discountReadOnly = false;
    } else if (id == 2) {
      this.discountApproachSelect = 2;
      this.discountReadOnly = true;
      this.productsUserWantTosale.forEach((prod) => {
        const discountInputElement = document.getElementById(
          `discountPerc${prod.id}`
        ) as HTMLInputElement;
        discountInputElement.value = String(prod.discount);
        this.updateTotalAmount(prod);
      });
    }
  }
  // deactiveCreateSalesComp() {
  //   this.activeSalesBillEntryEvent.emit(false)
  // }

  addTheProductForSale() {
    if (this.productBarCodeId === undefined) {
      return;
    }

    for (let i = 0; i < this.productsUserWantTosale.length; i++) {
      let eachProd: Product = this.productsUserWantTosale[i];
      if (eachProd.id === Number(this.productBarCodeId)) {
        // eachProd.id is number type and this.productBarCodeId is Number | undefined type. so we need to typecast explicitly
        return; //return doesnot work in foreach method
      }
    }

    this.productService
      .getProductById(this.productBarCodeId, this.companyId, this.branchId)
      .subscribe({
        next: (data) => {
          console.log(data.data);
          console.log('navin');
          if (data.data !== null) {
            this.productsUserWantTosale.push(data.data);
            this.productBarCodeId = undefined;
            setTimeout(() => {
              this.productsUserWantTosale.forEach((prod) => {
                this.updateTotalAmount(data.data);
              });
            });
          }
        },
      });
  }
  // advance logic for total amount updation
  updateTotalAmount(prod: Product) {
    let prodId = prod.id;
    let sellingPrice = prod.sellingPrice;
    console.log('selling price = ' + sellingPrice);

    // for tracking quantity
    const qtyProdElement = document.getElementById(
      `qtyProd${prodId}`
    ) as HTMLInputElement;
    let prodQty: number = Number(qtyProdElement.value);
    console.log('prodQty = ' + prodQty);

    // for tracking discount
    const discountPercElement = document.getElementById(
      `discountPerc${prod.id}`
    ) as HTMLInputElement;
    let discountPerc: number = Number(discountPercElement.value);
    console.log('discountPerc = ' + discountPerc);

    let totalAmountElement = document.getElementById(
      `totalAmount${prod.id}`
    ) as HTMLElement;

    if (this.taxApproach === 1) {
      let actSp = sellingPrice - (13 / (100 + 13)) * sellingPrice;
      let totalEachRow: number =
        (actSp - (discountPerc / 100) * actSp) * prodQty;
      totalAmountElement.innerText = String(Math.round(totalEachRow));
    } else {
      let totalEachRow: number =
        (sellingPrice - (discountPerc / 100) * sellingPrice) * prodQty;
      totalAmountElement.innerText = String(Math.round(totalEachRow));
    }

    // for tracking TaxRate
    // const vatRateTypesElement = document.getElementById(`vatRateTypes${prod.id}`) as HTMLSelectElement;
    // let vatRateTypes: number = Number(vatRateTypesElement.value);
    // console.log("vat rate types = " + vatRateTypes);

    // for tracking tax approach i.e tax inclusive or taxExclusive 1 for tax inclusive two tax Exclusive
    // let taxApproach: number = this.taxApproach;

    // for calculating total amount before tax approach
    // let singleProdPreTotal: number = (sellingPrice - (discountPerc / 100 * sellingPrice));

    // let trueTotalProductsPretotal: number = 0;
    // let totalProductsPretotal: number = 0;

    // // for updating total Amount
    // let totalAmountElement = document.getElementById(`totalAmount${prod.id}`) as HTMLElement;

    // if (taxApproach === 1) {

    //   if (vatRateTypes === 3) {//vattypes chai salesbilldetail table ma rakhae track garna
    //     totalProductsPretotal = (singleProdPreTotal - (13 / (100 + 13)) * singleProdPreTotal) * prodQty;
    //     totalAmountElement.innerHTML = String(Math.round(totalProductsPretotal));
    //   } else {
    //     totalAmountElement.innerHTML = String(Math.round(singleProdPreTotal * prodQty));

    //   }
    // }

    // if (taxApproach === 2) {
    //   let totalProductsPretotal = singleProdPreTotal * prodQty;
    //   totalAmountElement.innerHTML = String(Math.round(totalProductsPretotal));
    //   // but we have to store it somewhere in database; databse ko salesbill table ma taxApproach inclusive or exclusive rakhnae status;

    //   if (vatRateTypes === 3) {
    //     // let singleProductTotal = singleProdPreTotal + (13 / 100 * singleProdPreTotal);

    //   }

    // }
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

  removeItemFromCart(id: number) {
    this.productsUserWantTosale = this.productsUserWantTosale.filter(
      (prod) => prod.id !== id
    );
  }

  saleTheProducts(draft: boolean) {
    if (this.customerId === 0 || this.customerId === undefined) {
      this.tostrService.warning('please select the customer');
    }
    if (this.date === undefined) {
      this.tostrService.warning('please select date ');
    }
    if (this.productsUserWantTosale.length <= 0) {
      this.tostrService.warning('please enter at least one product');
    }

    if (
      this.customerId === 0 ||
      this.date === undefined ||
      this.customerId === undefined ||
      this.productsUserWantTosale.length <= 0
    )
      return;
    // const hidePopperBtn = document.getElementById(
    //   'closeAlertPopperButton'
    // ) as HTMLButtonElement;
    // hidePopperBtn.click();
    // this.customerIdEntryEvent.emit(this.customerId)
    this.productsUserWantTosale.forEach((prod) => {
      let saleBillDetail: SalesBillDetail = new SalesBillDetail();
      saleBillDetail.productId = prod.id;
      let qtyElement = document.getElementById(
        'qtyProd' + prod.id
      ) as HTMLInputElement;
      saleBillDetail.qty = Number(qtyElement.value);

      const discountPercElement = document.getElementById(
        `discountPerc${prod.id}`
      ) as HTMLInputElement;
      let discountPerc: number = Number(discountPercElement.value);

      saleBillDetail.discountPerUnit = discountPerc;

      const totalAmountEl = document.getElementById(
        `totalAmount${prod.id}`
      ) as HTMLElement;
      saleBillDetail.rowTotal = Number(totalAmountEl.innerText);
      saleBillDetail.companyId = this.loginService.getCompnayId(); //backend mai set gar

      // for accessing tax rate type
      const vatRateTypesElement = document.getElementById(
        `vatRateTypes${prod.id}`
      ) as HTMLInputElement;
      saleBillDetail.taxRate = Number(vatRateTypesElement.value);

      saleBillDetail.branchId = this.branchId; //backendma set gar
      saleBillDetail.date = new Date(this.date); //backend ma set gar
      saleBillDetail.rate = prod.sellingPrice;
      this.salesBillDetailInfos.push(saleBillDetail);
    });
    this.continueSelling(draft);
  }

  continueSelling(draft: boolean) {
    let salesBillDetailInfos = this.salesBillDetailInfos;
    // let amount = 0;
    // let discount = 0;
    // if (salesBillDetailInfos.length > 0) {
    //   for (let i = 0; i < salesBillDetailInfos.length; i++) {
    //     let prod = salesBillDetailInfos[i];
    //     amount += prod.qty * prod.rate;
    //     discount += prod.qty * prod.discountPerUnit;
    //   }
    // }
    // let taxableAmount = amount - discount;
    // let taxAmount = (13 / 100) * taxableAmount;
    // let totalAmount = taxableAmount + taxAmount;

    let salesBill: SalesBill = new SalesBill();
    let salesBillMaster: SalesBillMaster = new SalesBillMaster();

    this.calculateSubMetrics(salesBill);
    salesBill.customerId = this.customerId;
    salesBill.customerName = this.customerName;
    salesBill.customerPan = this.customerPan;
    salesBill.syncWithIrd = true;
    salesBill.billPrinted = false;
    salesBill.enteredBy = this.loginService.currentUser.user.email;
    salesBill.paymentMethod = 'CashInHand';
    salesBill.billDate = new Date(this.date);

    salesBill.userId = this.loginService.currentUser.user.id;
    salesBill.companyId = this.loginService.getCompnayId();
    salesBill.branchId = this.branchId; //mjremain
    salesBill.realTime = true;
    salesBill.billActive = true;
    salesBill.draft = draft;
    salesBill.taxApproach = this.taxApproach;
    salesBill.discountApproach = this.discountApproachSelect;
    salesBill.customerSearchMethod = this.customerSearchMethod;
    // salesBill.draft  = true mjremain
    salesBillMaster.salesBillDTO = salesBill;
    salesBillMaster.salesBillDetails = salesBillDetailInfos;
    salesBillMaster.alreadyDraft = this.alreadyDraft;
    console.log(salesBillMaster);
    console.log('ales bill master **********************');
    this.salesBillService.createNewSalesBill(salesBillMaster).subscribe({
      next: (data) => {
        console.log(data);
        if (draft === false) {
          this.router.navigateByUrl(`dashboard/salesbill/invoice/${data.data}`);
        } else {
          alert('Draft has been saved ');
          this.router.navigateByUrl('dashboard/salesbill');
        }
      },
    });
  }

  // salesBill.amount = 4567;
  // salesBill.discount = 345; //we have to calculate discount
  // salesBill.taxableAmount = 3211;
  // salesBill.taxAmount = 500;
  // salesBill.totalAmount = 4560;
  calculateSubMetrics(salesBill: SalesBill) {
    let discount: number = 0;
    let taxableAmount: number = 0;
    let taxAmount: number = 0;
    let totalAmount: number = 0;
    let amount: number = 0;
    this.productsUserWantTosale.forEach((prod) => {
      let taxElement = document.getElementById(
        `vatRateTypes${prod.id}`
      ) as HTMLSelectElement;
      let taxId: number = Number(taxElement.value);

      const discountEl = document.getElementById(
        `discountPerc${prod.id}`
      ) as HTMLInputElement;
      let discountPerc = Number(discountEl.value);

      const qtyEl = document.getElementById(
        `qtyProd${prod.id}`
      ) as HTMLInputElement;
      let qty = Number(qtyEl.value);

      if (this.taxApproach === 1) {
        let sp = prod.sellingPrice;

        if (taxId === 3) {
          sp = prod.sellingPrice - (13 / 113) * prod.sellingPrice;
          let discPerProd = (discountPerc / 100) * (sp * qty);
          let netAmountPerProd = sp * qty - discPerProd;
          let taxableAmountPerProd = sp * qty - discPerProd;
          let taxAmountPerProd = 0.13 * taxableAmountPerProd;
          let totalAmountPerProd = taxableAmountPerProd + taxAmountPerProd;
          discount += discPerProd;
          taxableAmount += taxableAmountPerProd;
          taxAmount += taxAmountPerProd;
          totalAmount += totalAmountPerProd;
          amount += netAmountPerProd;
        } else {
          sp = prod.sellingPrice;
          let discPerProd = (discountPerc / 100) * (sp * qty);
          let totalAmountPerProd = sp - discPerProd;
          let netAmountPerProd = totalAmountPerProd;

          amount += netAmountPerProd;
          discount += discPerProd;
          totalAmount += totalAmountPerProd;
        }
      } else if (this.taxApproach === 2) {
        let sp = prod.sellingPrice;
        let discountPerProd = (discountPerc / 100) * sp * qty;
        if (taxId === 3) {
          let taxableAmountPerProd = sp * qty - discountPerProd;
          let netAmountPerProd = sp * qty - discountPerProd;

          let taxAmountPerProd = 0.13 * taxableAmountPerProd;
          let totalAmountPerProd = taxableAmountPerProd + taxAmountPerProd;

          amount += netAmountPerProd;
          discount += discountPerProd;
          taxableAmount += taxableAmountPerProd;
          taxAmount += taxAmountPerProd;
          totalAmount += totalAmountPerProd;
        } else {
          discount += discountPerProd;
          let totalAmountPerProd = sp * qty - discountPerProd;
          totalAmount += totalAmountPerProd;
          let netAmountPerProd = totalAmountPerProd;

          amount += netAmountPerProd;
        }
      }

      // for calculatirng overall discount
    });
    salesBill.amount = amount;
    salesBill.taxableAmount = taxableAmount;
    salesBill.taxAmount = taxAmount;
    salesBill.totalAmount = totalAmount;
    salesBill.discount = discount;
  }
}
