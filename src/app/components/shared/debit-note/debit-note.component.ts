import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PurchaseBillDetailWithProdInfo } from 'src/app/models/PurchaseBillDetailWithProdInfo';
import { PurchaseBillInvoice } from 'src/app/models/PurchaseBillInvoice';
import { SalesBillDetailWithProdInfo } from 'src/app/models/SalesBillDetailWithProdInfo';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { DebitNoteService } from 'src/app/service/shared/Debit-Note/debit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.css'],
})
export class DebitNoteComponent {
  salesBillDetails!: SalesBillInvoice;
  productDetails!: PurchaseBillDetailWithProdInfo[];
  SelectedProductDetails!: PurchaseBillDetailWithProdInfo[];
  selectedProductReasons: { productId: number; reason: string }[] = [];
  PurchaseBillDetails = new PurchaseBillInvoice();
  selectedProductIds: number[] = [];
  serialNumber!: number;
  date!: string;
  billNo!: number;

  trigger!: boolean;

  constructor(
    private purchaseService: PurchaseBillService,
    private loginService: LoginService,
    private commonService: CommonService,
    private tosterService: ToastrService,
    private DebitService: DebitNoteService
  ) {}

  ngOnInit() {
    const length = 8;
    let serialNumber = '';
    for (let i = 0; i < length; i++) {
      serialNumber += Math.floor(Math.random() * 10);
    }
    this.serialNumber = Number(serialNumber);

    let date = new Date();
    this.date = this.commonService.formatDate(Number(date));
  }

  fetchPurchaseBillDetailForInvoice(BillId) {
    this.purchaseService
      .fetchPurchaseBillDetailForInvoice(
        BillId,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        console.log(res.data);
        this.PurchaseBillDetails = res.data;
        this.productDetails =
          this.PurchaseBillDetails.purchaseBillDetailsWithProd;
      });
  }

  selectedProduct(e: any, data: any) {
    if (e.target.checked === true) {
      this.trigger = true;
      this.SelectedProductDetails.push(data);
      this.selectedProductIds.push(data.productId);
    } else {
      this.trigger = false;
      this.SelectedProductDetails.pop();
      this.selectedProductIds.pop();
    }
  }

  onEnter(e: any) {
    let billNo = e.target.value;
    this.fetchPurchaseBillDetailForInvoice(billNo);
  }

  reasonchange(productId: number, e: any) {
    const index = this.selectedProductReasons.findIndex(
      (item) => item.productId === productId
    );
    if (index === -1) {
      this.selectedProductReasons.push({
        productId: productId,
        reason: e.target.value,
      });
    } else {
      this.selectedProductReasons[index].reason = e.target.value;
    }
  }

  onSubmit() {
    console.log(this.selectedProductReasons);

    if (this.trigger) {
      this.DebitService.addDebitNote({
        billNumber: String(
          this.billNo + this.PurchaseBillDetails.purchaseBillDTO.fiscalYear
        ),
        date: new Date(),
        id: this.serialNumber,
        panNumber: this.PurchaseBillDetails.purchaseBillDTO.sellerPan,
        receiverAddress: this.PurchaseBillDetails.purchaseBillDTO.sellerName,
        receiverName: this.PurchaseBillDetails.purchaseBillDTO.sellerName,
        totalAmount: 1929202,
        totalTax: 3982983,
      }).subscribe({
        next: (res) => {
          this.selectedProductReasons = [];

          this.SelectedProductDetails.map((data) => {
            this.DebitService.addDebitNoteDetails({
              debitAmount: this.PurchaseBillDetails.purchaseBillDTO.totalAmount,
              debitReason: 'nkjsksdklsd',
              debitTaxAmount:
                this.PurchaseBillDetails.purchaseBillDTO.taxAmount,
              productId: data.productId,
              productName: data.productName,
              SN: this.serialNumber,
            }).subscribe({
              next: (res) => {
                this.SelectedProductDetails = [];
                this.selectedProductIds = [];
              },
            });
          });
        },
      });
    }
    if (this.trigger === false) {
      this.tosterService.error('Please select the product');
    }
  }

  // getProductsByProductIds
  // fetchSalesBillDetailForInvoice
}
