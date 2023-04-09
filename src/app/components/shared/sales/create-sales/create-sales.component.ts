import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { ProductService } from 'src/app/service/product.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';
import { VatRateTypesService } from 'src/app/service/shared/vat-rate-types.service';
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
  customerName!: string;
  customerPan!: number;

  selectMenusForCompanies !: Company[];

  vatRateTypes: VatRateTypes[] = [];
  discountReadOnly: boolean = true;

  taxApproach: number = 1;

  date !: Date;

  // isconfirmAlert: boolean = false;
  // alertboxshowable: boolean = true;
  companyId!: number;
  constructor(
    private salesCartService: SalesCartService,
    private productService: ProductService,
    private salesBillService: SalesBillServiceService,
    private router: Router,
    private loginService: LoginService,
    private companyService: CompanyServiceService,
    private vatRateTypeService: VatRateTypesService,
  ) { }

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.getCompanyList();
    this.getVatRateTypes();
  }

  getVatRateTypes() {
    this.vatRateTypeService.getAllVatRateTypes().subscribe({
      next: (res) => {
        this.vatRateTypes = res.data;
      },
      error: (error) => { console.log(error) }
    });
  }

  setCustomerInfo($event: any) {
    let a = $event.target.value;
    let comp: Company = this.selectMenusForCompanies.find(comp => Number(comp.panNo) === Number(a))!
    this.customerId = Number(comp.panNo);
    this.customerName = comp.name;
    this.customerPan = Number(comp.panNo);
  }

  getApproach($event: any) {
    console.log($event.target.value);
    this.taxApproach = Number($event.target.value);
    console.log(this.taxApproach);

    this.productsUserWantTosale.forEach(prod => {
      this.updateTotalAmount(prod);
    })
  }
  getCompanyList() {
    this.companyService.getAllCompanies().subscribe({
      next: (data) => {
        this.selectMenusForCompanies = data.data;
      },
      error: (error) => { console.error(error) },
      complete: () => {

      }
    })
  }

  getBillDate($event: any) {
    this.date = new Date($event.target.value);
  }

  getDiscountMethod(id: number) {
    if (id === 1) {
      this.discountReadOnly = false;

    } else if (id == 2) {
      this.discountReadOnly = true;
      this.productsUserWantTosale.forEach(prod => {
        const discountInputElement = document.getElementById(`discountPerc${prod.id}`) as HTMLInputElement;
        discountInputElement.value = String(prod.discount);
        this.updateTotalAmount(prod);
      })
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
      if (eachProd.id === Number(this.productBarCodeId)) { // eachProd.id is number type and this.productBarCodeId is Number | undefined type. so we need to typecast explicitly
        return; //return doesnot work in foreach method
      }
    }

    this.productService
      .getProductByIdAndCompanyId(this.productBarCodeId, this.companyId)
      .subscribe({
        next: (data) => {
          console.log(data.data);
          console.log('navin');
          if (data.data !== null) {
            this.productsUserWantTosale.push(data.data);
            this.productBarCodeId = undefined;
            setTimeout(() => {
              this.productsUserWantTosale.forEach(prod => {
                this.updateTotalAmount(data.data);
              })
            })
          }
        }
      },
      );


  }
  // advance logic for total amount updation
  updateTotalAmount(prod: Product) {
    let prodId = prod.id;
    let sellingPrice = prod.sellingPrice;
    console.log("selling price = " + sellingPrice)

    // for tracking quantity
    const qtyProdElement = document.getElementById(`qtyProd${prodId}`) as HTMLInputElement;
    let prodQty: number = Number(qtyProdElement.value);
    console.log("prodQty = " + prodQty);

    // for tracking discount
    const discountPercElement = document.getElementById(`discountPerc${prod.id}`) as HTMLInputElement;
    let discountPerc: number = Number(discountPercElement.value);
    console.log("discountPerc = " + discountPerc);


    // for tracking TaxRate
    const vatRateTypesElement = document.getElementById(`vatRateTypes${prod.id}`) as HTMLSelectElement;
    let vatRateTypes: number = Number(vatRateTypesElement.value);
    console.log("vat rate types = " + vatRateTypes);

    // for tracking tax approach i.e tax inclusive or taxExclusive 1 for tax inclusive two tax Exclusive
    let taxApproach: number = this.taxApproach;


    // for calculating total amount before tax approach
    let singleProdPreTotal: number = (sellingPrice - (discountPerc / 100 * sellingPrice));

    let trueTotalProductsPretotal: number = 0;
    let totalProductsPretotal: number = 0;

    // for updating total Amount
    let totalAmountElement = document.getElementById(`totalAmount${prod.id}`) as HTMLElement;


    if (taxApproach === 1) {

      if (vatRateTypes === 3) {//vattypes chai salesbilldetail table ma rakhae track garna
        totalProductsPretotal = (singleProdPreTotal - (13 / (100 + 13)) * singleProdPreTotal) * prodQty;
        totalAmountElement.innerHTML = String(Math.round(totalProductsPretotal));
      } else {
        totalAmountElement.innerHTML = String(Math.round(singleProdPreTotal * prodQty));

      }
    }

    if (taxApproach === 2) {
      let totalProductsPretotal = singleProdPreTotal * prodQty;
      totalAmountElement.innerHTML = String(Math.round(totalProductsPretotal));
      // but we have to store it somewhere in database; databse ko salesbill table ma taxApproach inclusive or exclusive rakhnae status;


      if (vatRateTypes === 3) {
        // let singleProductTotal = singleProdPreTotal + (13 / 100 * singleProdPreTotal);


      }

    }



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

      const discountPercElement = document.getElementById(`discountPerc${prod.id}`) as HTMLInputElement;
      let discountPerc: number = Number(discountPercElement.value);

      saleBillDetail.discountPerUnit = discountPerc;
      saleBillDetail.date = this.date;
      saleBillDetail.companyId = this.loginService.getCompnayId();//backend mai set gar

      // for accessing tax rate type
      const vatRateTypesElement = document.getElementById(`vatRateTypes${prod.id}`) as HTMLInputElement;
      saleBillDetail.taxRate = Number(vatRateTypesElement.value);


      saleBillDetail.branchId = 0; //backendma set gar
      saleBillDetail.date = new Date() //backend ma set gar
      saleBillDetail.rate = prod.sellingPrice;
      this.salesBillDetailInfos.push(saleBillDetail);
    });
    this.continueSelling();
  }

  continueSelling() {
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
    salesBill.amount = 4567;
    salesBill.discount = 345; //we have to calculate discount
    salesBill.taxableAmount = 3211;
    salesBill.taxAmount = 500;
    salesBill.totalAmount = 4560;
    salesBill.customerId = this.customerId;
    salesBill.customerName = this.customerName;
    salesBill.customerPan = this.customerPan;
    salesBill.syncWithIrd = true;
    salesBill.billPrinted = false;
    salesBill.enteredBy = this.loginService.currentUser.user.email;
    salesBill.paymentMethod = 'CashInHand';
    salesBill.billDate = this.date;

    salesBill.userId = this.loginService.currentUser.user.id;
    salesBill.companyId = this.loginService.getCompnayId();
    salesBill.branchId = 0; //mjremain
    salesBill.realTime = true;
    salesBill.billActive = true;
    salesBill.taxApproach = this.taxApproach;
    // salesBill.draft  = true mjremain
    salesBillMaster.salesBillDTO = salesBill;
    salesBillMaster.salesBillDetails = salesBillDetailInfos;
    console.log(salesBillMaster)
    console.log("ales bill master **********************")
    this.salesBillService.createNewSalesBill(salesBillMaster).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl(
          `dashboard/salesbill/invoice/${data.data}`
        );
      },
    });
  }
}
