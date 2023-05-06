import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
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

  @ViewChild('saleTheProductBtn', { static: true }) saleTheProductBtn !: ElementRef;

  @ViewChild("createCustomerBtn", { static: true }) createCustomerBtn !: ElementRef;

  @ViewChild('prodQtyInput', { static: false }) prodQtyInput !: ElementRef;

  @ViewChild('productBarCodeInput', { static: false }) productBarCodeInput !: ElementRef;

  @ViewChild('selectedCustomerBtn', { static: false })
  myButtonRef!: ElementRef;

  @Output() salesBillDetailListEvent = new EventEmitter<SalesBillDetail[]>();
  @Output() activeSalesBillEntryEvent = new EventEmitter<boolean>();

  @Output() customerIdEntryEvent = new EventEmitter<number>();
  salesBillDetail: SalesBillDetail = new SalesBillDetail();
  salesBillDetailInfos: SalesBillDetail[] = [];

  salesBillDetailsForCart: SalesBillDetail[] = [];

  productBarCodeId: undefined | number;
  productsUserWantTosale: Product[] = [];

  productQtyUserWantTOSale: number = 1;
  productQty: number = 1
  customerCompany!: Company;
  customerId: number = 0;
  customerName!: string;
  customerPan!: number;
  productQtyForEntryStatus = false;

  saleType: number = 1 // 1->cash sale, 2-> credit sale

  selectMenusForCompanies!: Company[];

  vatRateTypes: VatRateTypes[] = [];
  discountReadOnly: boolean = true;

  discountApproachSelect: number = 2;
  selectMenusForCompaniesSize !: number;

  taxApproach: number = 1;

  currentBranch!: string;
  date!: string;
  // isconfirmAlert: boolean = false;
  // alertboxshowable: boolean = true;
  companyId!: number;
  branchId!: number;

  alreadyDraft: number = 0;
  taxApproachSelectEl: number = 2;
  customerSearchMethod: number = 1;
  custPhoneOrPan!: number;
  postgreDate !: Date;
  createCustomerEnable: boolean = false;
  selectCompanyActive: boolean = false;
  unknownCustomer: boolean = false;
  export: boolean = false;
  selectMenusForProduct: Product[] = []
  selectProductActive: boolean = false;
  prodWildCard !: string;
  allowEditSellingPrice: boolean = false;

  // for bill Summary
  bsSubTotal: number = 0;
  bsNetAmount: number = 0;
  bsDiscountAmount: number = 0;
  bsVatTaxableAmount: number = 0;
  bsTotal: number = 0;
  bsBalanceDue: number = 0;
  bsEstimatedFRSAmount: number = 0;


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

  @HostListener('document:keydown.control.enter', ['$event'])
  onCtrlEnterPressed(event: KeyboardEvent) {
    event.preventDefault();
    this.saleTheProductBtn.nativeElement.click();
  }


  ngAfterViewInit() {
    this.productBarCodeInput.nativeElement.focus();
  }

  getUnknownCustomer() {
    this.unknownCustomer = !this.unknownCustomer;
  }

  displayAddCustomerPopup() {
    this.createCustomerEnable = true;
    const createNewCustomerEl = document.getElementById("createNewCustomer") as HTMLButtonElement;
    createNewCustomerEl.click();
  }

  customerAdded($event) {
    this.createCustomerEnable = false;
    if ($event === true) {
      this.tostrService.success("Customer Has been added ");
      this.fetchCustomerInfo();
    }
  }

  onButtonKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.myButtonRef.nativeElement.click();
      this.createCustomerBtn.nativeElement.click(); // if customer available this run but create no impact
    }
  }
  setAllVatToZero() {
    this.export = !this.export;
    // if (this.export) {
    //   this.productsUserWantTosale.forEach((prod) => {
    //     const vatSelEl = document.getElementById(`vatRateTypes${prod.id}`) as HTMLSelectElement;
    //     vatSelEl.value = String(2); //2 for zero vat
    //   })
    // }
  }

  createNewProduct($event: boolean) {
    if ($event == true) {
      this.tostrService.success("Ok")
    }
  }

  updateAllowEditSP() {
    this.allowEditSellingPrice = !this.allowEditSellingPrice;

    const inputs = document.querySelectorAll('.productSellingPrice');
    inputs.forEach(input => {
      if (this.allowEditSellingPrice) {
        input.removeAttribute('readonly');

      } else {
        input.setAttribute('readonly', 'true');

      }
    });
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
        this.postgreDate = salesBillInvoice.salesBillDTO.billDate;
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
              this.updateBillSummary();
            });
          },
        });
      },
    });
  }

  manipulateDomItemsForDraft(
    salesBillDetailsWithProd: SalesBillDetailWithProdInfo[]
  ) {
    this.productsUserWantTosale.forEach((prod, index) => {
      const qtyEl = document.getElementById(
        `qtyProd${index}`
      ) as HTMLInputElement;
      const discountEl = document.getElementById(
        `discountPerc${index}`
      ) as HTMLInputElement;
      const totalAmountEl = document.getElementById(
        `totalAmount${index}`
      ) as HTMLElement;
      const vatSelEl = document.getElementById(`vatRateTypes${index}`) as HTMLSelectElement;

      let salesProd: SalesBillDetailWithProdInfo =
        salesBillDetailsWithProd.find((sp, i) => i === index)!;
      // this.selectedValueForTaxRateTypes = salesProd.taxRate;

      vatSelEl.value = String(salesProd.taxRate);
      qtyEl.value = String(salesProd.qty);
      discountEl.value = String(salesProd.discountPerUnit);
      totalAmountEl.innerText = String(salesProd.rowTotal);
    });
  }

  fetchCustomerInfo() {
    if (this.custPhoneOrPan === null || this.custPhoneOrPan === undefined) {
      this.tostrService.error(`pan or phone`, 'invalid number');
      return;
    }
    setTimeout(() => {
      this.selectCompanyActive = true;
    }, 200);
    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.customerSearchMethod,
        this.custPhoneOrPan
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;
        },
        complete: () => {
          const custBtn = document.getElementById(
            'selectCustomer'
          ) as HTMLButtonElement;
          custBtn.click();
          setTimeout(() => {
            this.createCustomerBtn.nativeElement.focus();
          })
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
    // const closeCustomerPopUpEl = document.getElementById(
    //   'closeCustPop'
    // ) as HTMLAnchorElement;
    // closeCustomerPopUpEl.click();
    this.destroySelectCustomerComponent(true);
  }

  closeSelectCustomerPopUp() {
    const closeCustomerPopUpEl = document.getElementById(
      'closeCustPop'
    ) as HTMLAnchorElement;
    closeCustomerPopUpEl.click();
  }

  destroySelectCustomerComponent($event: boolean) {
    this.selectCompanyActive = false;
  }

  destroySelectProductComponent($event: boolean) {
    this.selectProductActive = false;
  }

  getNameWildCard() {
    setTimeout(() => {
      this.selectProductActive = true;
    }, 200);
    const selectProductBtn = document.getElementById("selectProduct") as HTMLButtonElement;
    selectProductBtn.click();
    this.productService.getProductByWildCardName(this.prodWildCard, this.companyId, this.branchId).subscribe({
      next: (data) => {
        this.selectMenusForProduct = data.data
      }
    });
  }

  setProductSelectedByName(prod: Product) {
    this.productBarCodeId = prod.id;
    this.prodQtyInput.nativeElement.focus();
  }

  getApproach($event: any) {
    console.log($event.target.value);
    this.taxApproach = Number($event.target.value);
    console.log(this.taxApproach);

    this.productsUserWantTosale.forEach((prod, index) => {
      this.updateTotalAmount(index);
    });
    this.updateBillSummary();
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
        this.productsUserWantTosale.forEach((prod, index) => {
          this.updateTotalAmount(index);
        })
        this.updateBillSummary();

        // this.updateTotalAmount(prod);
      });
    }
  }


  setSaleType(id: number) {
    this.saleType = id;

  }

  goToProductQtyField() {
    if (this.productBarCodeId! > 0) {
      this.prodQtyInput.nativeElement.focus();
    }
  }


  addTheProductForSale() {
    if (this.productBarCodeId === undefined) {
      return;
    }
    /** code for checking whether the product already exists in cart. Now not needed */
    // for (let i = 0; i < this.productsUserWantTosale.length; i++) {
    //   let eachProd: Product = this.productsUserWantTosale[i];
    //   if (eachProd.id === Number(this.productBarCodeId)) {
    //     // eachProd.id is number type and this.productBarCodeId is Number | undefined type. so we need to typecast explicitly
    //     this.tostrService.error("product already added ");
    //     return; //return doesnot work in foreach method

    //   }
    // }

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
              this.productsUserWantTosale.forEach((prod, index) => {
                this.productQtyForEntryStatus = true;
                // this.updateTotalAmount(data.data);
                this.updateTotalAmount(index);
                this.productQtyForEntryStatus = false;
                this.productQty = 1;
              });
              this.updateBillSummary();

            });
          }
          if (data.data === null) {
            this.tostrService.error("product not available");
          }
          this.productBarCodeInput.nativeElement.focus();
        },
      });
  }
  // advance logic for total amount updation
  updateTotalAmount(index: number) {


    // for fetching selling price
    let prodSellingPriceEL = document.getElementById(`prodSellingPrice${index}`) as HTMLInputElement
    let sellingPrice = Number(prodSellingPriceEL.value);

    // for tracking quantity
    const qtyProdElement = document.getElementById(
      `qtyProd${index}`
    ) as HTMLInputElement;

    if (this.productQtyForEntryStatus === true) {
      qtyProdElement.value = String(this.productQty);//
    }
    let prodQty: number = Number(qtyProdElement.value);

    // for tracking discount
    const discountPercElement = document.getElementById(
      `discountPerc${index}`
    ) as HTMLInputElement;
    let discountPerc: number = Number(discountPercElement.value);

    const varRateTypeEl = document.getElementById(`vatRateTypes${index}`) as HTMLSelectElement;
    let eachVatRateId: Number = Number(varRateTypeEl.value);
    let eachVatRateNum: number = 0;
    this.vatRateTypes.forEach((vrt) => {
      if (vrt.id === eachVatRateId) {
        eachVatRateNum = vrt.vatRateNum;
      }
    })

    let totalAmountElement = document.getElementById(
      `totalAmount${index}`
    ) as HTMLElement;

    if (this.taxApproach === 1) {
      let actSp = sellingPrice - (eachVatRateNum / (100 + eachVatRateNum)) * sellingPrice;
      let totalEachRow: number =
        (actSp - (discountPerc / 100) * actSp) * prodQty;
      let totalEachRow2 = totalEachRow + (eachVatRateNum / 100) * totalEachRow;
      totalAmountElement.innerText = String(Math.round(totalEachRow2));
    } else {
      let totalEachRow: number =
        (sellingPrice - (discountPerc / 100) * sellingPrice) * prodQty;
      totalAmountElement.innerText = String(Math.round(totalEachRow));
    }
  }


  updateBillSummary() {

    this.bsTotal = 0;
    this.bsSubTotal = 0;
    this.bsVatTaxableAmount = 0;
    this.bsNetAmount = 0;
    this.bsDiscountAmount = 0;
    this.bsBalanceDue = 0;

    this.productsUserWantTosale.forEach((prod, index) => {

      const pTotalElement = document.getElementById(`totalAmount${index}`) as HTMLElement;
      let pTotal: number = Number(pTotalElement.innerText);

      let prodSellingPriceEL = document.getElementById(`prodSellingPrice${index}`) as HTMLInputElement
      let sellingPrice = Number(prodSellingPriceEL.value);

      const varRateTypeEl = document.getElementById(`vatRateTypes${index}`) as HTMLSelectElement;
      let eachVatRateId: Number = Number(varRateTypeEl.value);

      // for fetching vat rate number value from id
      let eachVatRateNum: number = 0;
      this.vatRateTypes.forEach((vrt) => {
        if (vrt.id === eachVatRateId) {
          eachVatRateNum = vrt.vatRateNum;
        }
      })

      const qtyProdElement = document.getElementById(
        `qtyProd${index}`
      ) as HTMLInputElement;
      // if (this.productQtyForEntryStatus === true) {
      //   qtyProdElement.value = String(this.productQty);//
      // }
      let prodQty: number = Number(qtyProdElement.value);

      const discountPercElement = document.getElementById(
        `discountPerc${index}`
      ) as HTMLInputElement;
      let discountPerc: number = Number(discountPercElement.value);

      this.bsDiscountAmount += (discountPerc / 100 * sellingPrice) * prodQty;
      if (this.taxApproach === 2) {
        // for tax exclusiveness
        this.bsSubTotal += pTotal;
        this.bsTotal += pTotal + (eachVatRateNum / 100 * sellingPrice) * prodQty;//userle edit gareko sp anusar vat change hunxa.
        this.bsNetAmount += (sellingPrice - discountPerc / 100 * sellingPrice) * prodQty;
        if (eachVatRateId === 3) {//taxableamount is calculated only if vatrateid is equals to 3.
          this.bsVatTaxableAmount += (sellingPrice - discountPerc / 100 * sellingPrice) * prodQty;
        }
      }

      if (this.taxApproach === 1) {
        // for subtotal
        this.bsSubTotal += pTotal;
        this.bsTotal = this.bsSubTotal;

        let actSp = sellingPrice - (eachVatRateNum / (100 + eachVatRateNum)) * sellingPrice;
        let totalEachRowTaxableAmount: number =
          (actSp - (discountPerc / 100) * actSp) * prodQty;
        if (eachVatRateId === 3) {//taxableamount is calculated only if vatrateid is equals to 3.
          this.bsVatTaxableAmount += totalEachRowTaxableAmount;
        }
        this.bsNetAmount += totalEachRowTaxableAmount
      }
    })

    this.bsBalanceDue = this.bsTotal;
    this.bsEstimatedFRSAmount = 13 / 100 * this.bsTotal;
  }

  removeItemFromCart(i: number) {
    this.productsUserWantTosale = this.productsUserWantTosale.filter(
      (prod, index) => index !== i
    );
  }

  saleTheProducts(draft: boolean) {
    if (this.unknownCustomer === false) {
      if (this.customerId === 0 || this.customerId === undefined) {
        this.tostrService.warning('please select the customer');
        return;
      }
    }

    if (this.date === undefined) {
      this.tostrService.warning('please select date ');
      return;
    }
    if (this.productsUserWantTosale.length <= 0) {
      this.tostrService.warning('please enter at least one product');
      return;
    }
    this.productsUserWantTosale.forEach((prod, index) => {
      let saleBillDetail: SalesBillDetail = new SalesBillDetail();
      saleBillDetail.productId = prod.id;
      let qtyElement = document.getElementById(
        'qtyProd' + index
      ) as HTMLInputElement;
      saleBillDetail.qty = Number(qtyElement.value);

      const discountPercElement = document.getElementById(
        `discountPerc${index}`
      ) as HTMLInputElement;
      let discountPerc: number = Number(discountPercElement.value);

      saleBillDetail.discountPerUnit = discountPerc;

      const totalAmountEl = document.getElementById(
        `totalAmount${index}`
      ) as HTMLElement;
      saleBillDetail.rowTotal = Number(totalAmountEl.innerText);
      saleBillDetail.companyId = this.loginService.getCompnayId(); //backend mai set gar

      // for accessing tax rate type
      const vatRateTypesElement = document.getElementById(
        `vatRateTypes${index}`
      ) as HTMLInputElement;
      saleBillDetail.taxRate = Number(vatRateTypesElement.value);

      saleBillDetail.branchId = this.branchId; //backendma set gar
      saleBillDetail.date = new Date(this.date); //backend ma set gar

      // setting sellingprice dynamically form dom because user can edit it. so we have to make it dynamic.
      const sellingPriceEl = document.getElementById(`prodSellingPrice${index}`) as HTMLInputElement;
      saleBillDetail.rate = Number(sellingPriceEl.value);
      this.salesBillDetailInfos.push(saleBillDetail);
    });
    this.continueSelling(draft);
  }

  continueSelling(draft: boolean) {
    let salesBillDetailInfos = this.salesBillDetailInfos;

    let salesBill: SalesBill = new SalesBill();
    let salesBillMaster: SalesBillMaster = new SalesBillMaster();

    // this.calculateSubMetrics(salesBill);
    salesBill.amount = this.bsNetAmount;
    salesBill.taxableAmount = this.bsVatTaxableAmount;
    salesBill.taxAmount = 13 / 100 * this.bsVatTaxableAmount;
    salesBill.totalAmount = this.bsTotal;
    salesBill.discount = this.bsDiscountAmount;
    // finished

    salesBill.customerId = this.customerId;
    salesBill.customerName = this.customerName;
    salesBill.customerPan = this.customerPan;
    salesBill.syncWithIrd = true;
    salesBill.billPrinted = false;
    salesBill.enteredBy = this.loginService.currentUser.user.email;
    salesBill.paymentMethod = 'CashInHand';
    console.log("start--------------------");
    console.log(this.date);
    salesBill.billDate = new Date(this.date);
    console.log(salesBill.billDate)
    console.log("end-----------------------")

    salesBill.userId = this.loginService.currentUser.user.id;
    salesBill.companyId = this.loginService.getCompnayId();
    salesBill.branchId = this.branchId; //mjremain
    salesBill.counterId = 1;
    salesBill.realTime = true;
    salesBill.billActive = true;
    salesBill.draft = draft;
    salesBill.taxApproach = this.taxApproach;
    salesBill.discountApproach = this.discountApproachSelect;
    salesBill.customerSearchMethod = this.customerSearchMethod;
    salesBill.saleType = this.saleType
    // salesBill.draft  = true mjremain
    salesBillMaster.salesBillDTO = salesBill;
    salesBillMaster.salesBillDetails = salesBillDetailInfos;
    salesBillMaster.alreadyDraft = this.alreadyDraft;
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

      let prodSellingPriceEL = document.getElementById(`prodSellingPrice${prod.id}`) as HTMLInputElement
      let finalSellingPrice = Number(prodSellingPriceEL.value);

      if (this.taxApproach === 1) {
        let sp = prod.sellingPrice;
        if (taxId === 3) {
          sp = finalSellingPrice - (13 / 113) * finalSellingPrice;
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
          sp = finalSellingPrice;
          let discPerProd = (discountPerc / 100) * (sp * qty);
          let totalAmountPerProd = sp - discPerProd;
          let netAmountPerProd = totalAmountPerProd;

          amount += netAmountPerProd;
          discount += discPerProd;
          totalAmount += totalAmountPerProd;
        }
      } else if (this.taxApproach === 2) {
        let sp = finalSellingPrice;
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
