import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from 'src/app/models/Product';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import { User } from 'src/app/models/user';
import { ProductService } from 'src/app/service/product.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';

@Component({
  selector: 'app-create-sales',
  templateUrl: './create-sales.component.html',
  styleUrls: ['./create-sales.component.css']
})
export class CreateSalesComponent {
  @Output() salesBillDetailListEvent = new EventEmitter<SalesBillDetail[]>();
  @Output() activeSalesBillEntryEvent = new EventEmitter<boolean>();

  @Output() customerIdEntryEvent = new EventEmitter<number>();
  salesBillDetail: SalesBillDetail = new SalesBillDetail;
  salesBillDetailInfos: SalesBillDetail[] = [];

  salesBillDetailsForCart: SalesBillDetail[] = [];

  productBarCodeId: undefined | number;
  productsUserWantTosale: Product[] = [];
  productQtyUserWantTOSale: number = 1;
  customerId !: number;

  constructor(private salesCartService: SalesCartService, private productService: ProductService) { }

  ngOnInit() {
    console.log("ng on init create sales component  ")
    if (localStorage.getItem("SalesCart") !== null) {
      this.salesBillDetailsForCart = JSON.parse(localStorage.getItem("SalesCart")!);
    }
    // this.salesCartService.currentProdsInSalesCart.subscribe(cartInfo => this.salesBillDetailsForCart);

  }

  ngOnDestroy() {
    console.log("destorying create-sales component")
  }
  // submitSalesBillForm(form: NgForm) {
  //   this.salesBillDetailInfos.push(this.salesBillDetail);
  //   this.salesBillDetail = new SalesBillDetail;
  //   form.reset();
  // }

  updateQty($event: any, productId: number) {
    this.salesBillDetailsForCart.forEach((item) => {
      if (item.productId == productId) {
        item.qty = $event.target.value;
      }
    })
    localStorage.setItem("SalesCart", JSON.stringify(this.salesBillDetailsForCart))
    // this.salesCartService.updateSalesCartInfo(this.salesBillDetailsForCart)
    //
  }


  deactiveCreateSalesComp() {
    this.activeSalesBillEntryEvent.emit(false)
  }


  addTheProductForSale() {
    if (this.productBarCodeId === undefined) {
      return;
    }
    this.productService.getProductById(this.productBarCodeId).subscribe((data) => {
      console.log(data.data);
      console.log("navin");
      if (data.data !== null) {
        this.productsUserWantTosale.push(data.data);
        this.productBarCodeId = undefined;

      }
    })
  }
  updateProdQtyUserWantToSale($event: any, prod: Product) {
    if ($event.target.value === undefined) {
      return;
    }
    let qtyProd = $event.target.value;
    const prodtotalAmountElement = document.getElementById("totalAmount" + prod.id) as HTMLElement;
    let prodTotalAmount = Number(qtyProd) * prod.sellingPrice;
    prodtotalAmountElement.innerText = '' + prodTotalAmount;
  }


  saleTheProducts() {
    // this.salesBillDetailInfos = JSON.parse(localStorage.getItem("SalesCart")!)
    if (this.customerId === 0 || this.customerId === undefined) return;
    console.log(this.customerId);
    this.customerIdEntryEvent.emit(this.customerId)
    this.productsUserWantTosale.forEach(prod => {
      let saleBillDetail: SalesBillDetail = new SalesBillDetail;
      saleBillDetail.productId = prod.id;
      let qtyElement = document.getElementById("qtyProd" + prod.id) as HTMLInputElement;
      saleBillDetail.qty = Number(qtyElement.value);
      saleBillDetail.discountPerUnit = prod.discount;
      saleBillDetail.rate = prod.sellingPrice;
      this.salesBillDetailInfos.push(saleBillDetail);
    })
    console.log("%%%%%%%%%%%%%%")
    console.log(this.salesBillDetailInfos);
    this.salesBillDetailListEvent.emit(this.salesBillDetailInfos);

  }

}
