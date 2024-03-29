import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SplitProduct } from 'src/app/models/SplitProduct';
import { LoginService } from 'src/app/service/shared/login.service';
import { SplitProductService } from 'src/app/service/shared/SplitProduct/split-product.service';
import { StockService } from 'src/app/service/stock/stock.service';
import { ProductService } from 'src/app/service/product.service';
import { InventoryProducts } from 'src/app/models/InventoryProducts';
import { RJResponse } from 'src/app/models/rjresponse';
import { ToastrService } from 'ngx-toastr';
import { Unit } from 'src/app/models/Unit';
import { Product } from 'src/app/models/Product';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { Stock, UpdateStock } from 'src/app/models/Stock';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-split-product',
  templateUrl: './split-product.component.html',
  styleUrls: ['./split-product.component.css'],
})
export class SplitProductComponent {
  title: string = 'product';
  @Input() selectMenusForProduct!: Product[];
  @Output() destroySelectProdEmitter = new EventEmitter<boolean>(false);
  splitProducts!: SplitProduct[];
  Unit: Unit[] = [];
  availableProducts: Product[] = [];
  typerate: VatRateTypes[] = [];
  fetchstock!: Stock;
  companyId!: number;
  branchId!: number;
  compId!: number;
  tax!: number;
  updateproductId!: number;
  // product!: any;
  showForm!: boolean;
  SplitProductObj: SplitProduct = new SplitProduct();
  createproduct: Product = new Product();
  updatedProductName!: string;
  updatestock: UpdateStock = new UpdateStock();
  enableCreateMergeComp: boolean = false;
  idForMergeComp!: number;
  enableCreateSplitComp: boolean = false;
  enableMergeComp: boolean = false;
  searchText!: any;
  idForSplitComp!: number;
  // selectMenusForProduct: Product[] = []
  selectProductActive: boolean = false;
  prodWildCard!: string;
  searchWildCard !: string;

  searchBy!: string;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  constructor(
    private loginService: LoginService,
    private SplitProductService: SplitProductService,
    private productService: ProductService,
    private toastrService: ToastrService,
    private StockService: StockService
  ) { }

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.compId = this.loginService.getCompnayId();
    // this.getAllSplitProduct();
    this.fetchLimitedSplitProducts();
    this.getAllVatRateTypes();

    console.log(this.companyId, this.branchId);
  }
  ngOnChanges() {
    // this.getSplitProductById();
    this.getallstock(
      this.SplitProductObj.productId,
      this.SplitProductObj.companyId
    );
    this.resetForm();
  }

  getallstock(productId: number, companyId: number) {
    // console.log("productId"+this.SplitProductObj.productId);
    this.StockService.getStockWithProdId(
      this.SplitProductObj.productId
    ).subscribe((data) => {
      this.fetchstock = data.data;
      // this.updatestock=this.fetchstock;
      console.log('get stock qty atul' + JSON.stringify(this.fetchstock));
    });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedSplitProducts();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedSplitProducts();
    }
  }

  fetchLimitedSplitProducts() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.SplitProductService.getLimitedSplitProduct(
      offset,
      this.pageTotalItems,
      this.companyId,
      this.branchId
    ).subscribe((res) => {
      if (res.data.length === 0) {
        this.toastrService.error('bills not found ');
        this.currentPageNumber -= 1;
      } else {
        this.splitProducts = res.data;
      }
    });
  }

  getAllSplitProduct() {
    this.SplitProductService.getAllSplitProduct(
      this.companyId,
      this.branchId
    ).subscribe((data) => {
      this.splitProducts = data.data;
    });
  }

  fetchAllProducts(compId: number, branchId: number) {
    this.productService.getAllProducts(compId, branchId).subscribe((data) => {
      this.availableProducts = data.data;
    });
  }
  setProductSelectedByName(prod: Product) {
    //  const productNameEL = document.getElementById("productName") as HTMLSelectElement;
    //  productNameEL.value = prod.name;
    //  this.SplitProductObj.productName = prod.name;
    //  this.SplitProductObj.id = prod.id;
    this.selectProductId(prod.id);
    //  alert(JSON.stringify(this.SplitProductObj))
  }
  destroySelectProductComponent($event: boolean) {
    this.selectProductActive = false;
  }

  getTheProductForSplit(id: number) {
    this.resetForm();
    this.enableCreateSplitComp = true;
    this.idForSplitComp = id;
  }
  getTheProductForMerge(id: number) {
    this.resetForm();
    this.enableCreateMergeComp = true;
    this.idForMergeComp = id;
  }
  addSplitProduct(form: any) {
    this.showForm = true;
    this.SplitProductObj.companyId = this.loginService.getCompnayId();
    this.SplitProductObj.branchId = this.branchId;

    this.SplitProductObj.totalQty =
      this.SplitProductObj.qty * this.SplitProductObj.splitQty;
    this.createproduct.name = this.SplitProductObj.updatedProductName;
    this.createproduct.description =
      'splited product' + `${this.SplitProductObj.productName}`;
    this.createproduct.userId = this.createproduct.userId;
    this.createproduct.sellingPrice = this.SplitProductObj.price;
    this.createproduct.categoryId = this.createproduct.categoryId;
    this.createproduct.tax = this.SplitProductObj.tax;
    this.createproduct.companyId = this.companyId;
    this.createproduct.branchId = this.branchId;
    this.createproduct.unit = this.SplitProductObj.unit;
    this.updatestock.companyId = this.companyId;
    this.updatestock = this.fetchstock;
    this.updatestock.createDate = this.fetchstock.createDate;
    this.updatestock.productId = this.fetchstock.productId;
    this.updatestock.qty = this.fetchstock.qty - this.SplitProductObj.splitQty;
    console.log(
      'this.SplitProductObj.splitQty' + this.SplitProductObj.splitQty
    );
    console.log('this.updatestock.qty' + this.updatestock.qty);
    console.log('addsplit product' + JSON.stringify(this.SplitProductObj));
    this.productService
      .addNewProduct(this.createproduct, this.SplitProductObj.totalQty)
      .subscribe({
        next: (data) => {
          console.log(data.data);
          this.toastrService.success(
            'product has been added with id ' + data.data
          );
          this.updateproductId = data.data;
          this.SplitProductObj.updatedProductId = this.updateproductId;
          // alert(JSON.stringify (this.SplitProductObj))
          this.SplitProductService.addSplitProduct(
            this.SplitProductObj
          ).subscribe({
            next: (data) => {
              // this.createProduct(data);
              this.toastrService.success(
                'split is successfully added with id ' + data.data
              );
              this.getAllSplitProduct();
            },
            error: (err) => {
              this.toastrService.error('something went wrong');
            },
          });
        },
        error: (error) => {
          console.log('Error occured ');
        },
      });

    this.StockService.updateStockWithProdId(
      this.updatestock.id,
      this.updatestock
    ).subscribe({
      next: (data) => {
        console.log('stock update ' + this.updatestock.id);
        this.toastrService.success('stock updated');
      },
      error: (error) => {
        console.log('Error occured ');
      },
    });

    // this.StockService.addStock(this.updatestock).subscribe({
    //   next: (data) => {
    //     console.log("add "+this.updatestock.id);
    //     this.toastrService.success("stock updated")

    //   },
    //   error: (error) => {
    //     console.log('Error occured ');

    //   }

    // });

    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }

  openForm() {
    this.resetForm();
    this.showForm = true;
    this.getALLUnit();
    this.getAllVatRateTypes();
    this.fetchAllProducts(this.compId, this.branchId);
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

  selectProductId(productId: number) {
    // alert(productName)
    console.log('selected producted by it ' + productId);
    const product = this.availableProducts.find((p) => p.id === productId);

    console.log('selected product ' + product);
    if (product) {
      console.log(product);
      this.SplitProductObj.productId = product.id;
      this.SplitProductObj.unit = product.unit;
      this.SplitProductObj.productName = product.name;
      this.createproduct.tax = this.SplitProductObj.tax = product.tax;
      this.SplitProductObj.qty = product.qtyPerUnit;
      this.createproduct.categoryId = product.categoryId;
      this.createproduct.userId = product.userId;
      // console.log("tax"+this.tax);
      this.getallstock(product.id, product.companyId);
    }
  }
  destroyCreateSplitProductComponent($event: boolean) {
    if ($event) this.enableCreateSplitComp = false;
  }
  destroyCreateMergeProductComponent($event: boolean) {
    if ($event) this.enableCreateMergeComp = false;
    // alert(this.enableMergeComp)
  }

  resetForm() {
    this.SplitProductObj = new SplitProduct();
  }
  // sotock(qty:number,productId:number){
  //   this.StockService.getStockWithProdId(productId).subscribe((data)=>{
  //     this.fetchstock = data.data;
  //     if(this.fetchstock.qty<qty){
  //       alert("enter valid input for stock quanty")
  //     }
  //   })
  // }

  // createProduct(_data: any) {
  //   this.createproduct.companyId = this.companyId;
  //   this.createproduct.branchId = this.branchId;
  //   this.createproduct.name="test";
  //   this.createproduct.description="splited product";
  //   this.createproduct.userId=1;
  //   this.createproduct.sellingPrice=200;
  //   this.createproduct.categoryId=this.createproduct.categoryId=1;
  //   this.createproduct.tax=this.createproduct.tax=1;

  //   this.productService.addNewProduct(this.createproduct).subscribe({
  //     next: (data) => {
  //       console.log(data.data);
  //       this.toastrService.success("product has been added with id " + data.tax)
  //       console.log("next"+this.createproduct.tax);
  //     },
  //     error: (error) => {
  //       console.log('Error occured ');

  //     }
  //   });
  // }
  cancel_btn() {
    this.showForm = false;
    const bankForm = document.getElementById('createNewCategoryPopup');

    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }

  getNameWildCard(prodName: string) {
    // alert(JSON.stringify(prodName));
    // alert(JSON.stringify(this.SplitProductObj))
    setTimeout(() => {
      this.selectProductActive = true;
      const selectProductPopUpEl = document.getElementById(
        'selectProduct'
      ) as HTMLButtonElement;
      selectProductPopUpEl.click();
    }, 1000);

    this.productService
      .getProductByWildCardName(prodName, this.companyId, this.branchId)
      .subscribe({
        next: (data) => {
          this.selectMenusForProduct = data.data;
          // alert(JSON.stringify(this.selectMenusForProduct))
        },
      });
  }
}
