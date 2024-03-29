import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MergeProduct } from 'src/app/models/MergeProduct';
import { LoginService } from 'src/app/service/shared/login.service';
import { MergeProductService } from 'src/app/service/shared/MergeProduct/merge-product.service';
import { ToastrService } from 'ngx-toastr';
import { SplitProductService } from 'src/app/service/shared/SplitProduct/split-product.service';
import { StockService } from 'src/app/service/stock/stock.service';
import { ProductService } from 'src/app/service/product.service';
import { SplitProduct } from 'src/app/models/SplitProduct';
import { Unit } from 'src/app/models/Unit';
import { Product } from 'src/app/models/Product';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { Stock } from 'src/app/models/Stock';

@Component({
  selector: 'app-merge-product',
  templateUrl: './merge-product.component.html',
  styleUrls: ['./merge-product.component.css'],
})
export class MergeProductComponent {
  @Input() id!: number;
  @Output() enableMergeComp = new EventEmitter<boolean>(false);

  Unit: Unit[] = [];
  availableProducts: Product[] = [];
  typerate: VatRateTypes[] = [];
  SplitProductObj: SplitProduct = new SplitProduct();
  createproduct: Product = new Product();
  companyId!: number;
  branchId!: number;
  compId!: number;
  splitProducts!: SplitProduct[];
  fetchstock!: Stock;
  Math!: any;
  constructor(
    private loginService: LoginService,
    private SplitProductService: SplitProductService,
    private productService: ProductService,
    private toastrService: ToastrService,
    private StockService: StockService
  ) {}
  ngOnInit() {
    this.resetForm();
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.compId = this.loginService.getCompnayId();
    this.getALLUnit();
    this.getSplitProductById();
    this.getAllVatRateTypes();

    setTimeout(() => {
      const htmlInputEL = document.getElementById(
        'splitQty'
      ) as HTMLInputElement;
      htmlInputEL.focus();
    });
    console.log(this.companyId, this.branchId);
  }

  ngOnChanges() {
    this.getSplitProductById();
    this.getallstock(
      this.SplitProductObj.updatedProductId,
      this.SplitProductObj.companyId
    );
  }

  getSplitProductById() {
    this.SplitProductService.getSplitProductById(this.id).subscribe((res) => {
      this.SplitProductObj = res.data[0];
      console.log(this.SplitProductObj);

      this.getallstock(
        this.SplitProductObj.updatedProductId,
        this.SplitProductObj.companyId
      );

      // alert(JSON.stringify(this.SplitProductObj))
    });
  }

  getallstock(productId: number, companyId: number) {
    console.log('productId' + this.SplitProductObj.updatedProductId);
    this.StockService.getStockWithProdId(
      this.SplitProductObj.updatedProductId
    ).subscribe((data) => {
      this.fetchstock = data.data;
      // this.updatestock=this.fetchstock;
      // console.log("get stock qty atul"+JSON.stringify(this.fetchstock));
    });
  }

  selectProductId(productName: string) {
    const product = this.availableProducts.find((p) => p.name === productName);
    if (product) {
      this.SplitProductObj.productId = product.id;
      this.createproduct.tax = this.SplitProductObj.tax = product.tax;
      this.SplitProductObj.qty = product.qtyPerUnit;
      this.createproduct.categoryId = product.categoryId;
      this.createproduct.userId = product.userId;

      this.getallstock(product.id, product.companyId);
    }
  }
  getALLUnit() {
    this.productService.getAllUnit().subscribe((res) => {
      this.Unit = res.data;
    });
  }
  getAllVatRateTypes() {
    this.productService.getAllVatRateTypes().subscribe((res) => {
      console.log(res.data);
      this.typerate = res.data;
    });
  }

  Merge(form: any) {
    // alert(JSON.stringify(this.SplitProductObj));
    this.SplitProductService.Merge(this.SplitProductObj).subscribe((res) => {
      this.toastrService.success('stock Mearge ');
      this.getallstock(
        this.SplitProductObj.updatedProductId,
        this.SplitProductObj.companyId
      );

      const closeBtnEl = document.getElementById(
        'closeBtn'
      ) as HTMLButtonElement;
      closeBtnEl.click();
    });
  }
  cancle() {
    this.getallstock(
      this.SplitProductObj.updatedProductId,
      this.SplitProductObj.companyId
    );
  }
  resetForm() {
    this.SplitProductObj = new SplitProduct();
  }

  destroyCancelComp() {
    const closeBtnEl = document.getElementById('closeBtn') as HTMLButtonElement;

    closeBtnEl.click();
  }

  destroyComp() {
    this.enableMergeComp.emit(true);
  }
}
