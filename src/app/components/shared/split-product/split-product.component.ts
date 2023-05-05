  import { Component } from '@angular/core';
  import { SplitProduct } from 'src/app/models/SplitProduct';
  import { LoginService } from 'src/app/service/shared/login.service';
  import {SplitProductService} from 'src/app/service/shared/SplitProduct/split-product.service'
  import { StockService } from 'src/app/service/stock/stock.service';
  import { ProductService } from 'src/app/service/product.service';
  import { InventoryProducts } from 'src/app/models/InventoryProducts';
  import { RJResponse } from 'src/app/models/rjresponse';
  import { ToastrService } from 'ngx-toastr';
  import { Unit } from 'src/app/models/Unit';
  import { Product } from 'src/app/models/Product';
  import { VatRateTypes } from 'src/app/models/VatRateTypes';
  import { Stock, UpdateStock } from 'src/app/models/Stock';

  @Component({
    selector: 'app-split-product',
    templateUrl: './split-product.component.html',
    styleUrls: ['./split-product.component.css']
  })
  export class SplitProductComponent {
    splitProducts!: SplitProduct[] ;
    Unit:Unit[]=[];
    availableProducts: Product[] = [];
    typerate:VatRateTypes[]=[];
    fetchstock!:Stock;
    companyId!: number;
    branchId !: number;
    compId!:number;
    tax!:number;
    updateproductId!:number;
    // product!: any;
    showForm!: boolean;
    SplitProductObj: SplitProduct = new SplitProduct;
    createproduct : Product=new Product;
    updatedProductName!: string;
    updatestock: UpdateStock =new UpdateStock;
    enableCreateMergeComp:boolean=false;
    idForMergeComp!:number;
    enableCreateSplitComp : boolean = false;
    idForSplitComp !: number;
    
    constructor(
      
      private loginService: LoginService,
      private SplitProductService:SplitProductService,
      private productService:ProductService,
      private toastrService: ToastrService,
      private StockService:StockService,
      
    ) { }
    ngOnInit() {
      this.companyId = this.loginService.getCompnayId();
      this.branchId = this.loginService.getBranchId();
      this.compId=this.loginService.getCompnayId();
      this.getAllSplitProduct();
      
      
      console.log(this.companyId, this.branchId);
      
    }


    getallstock(productId:number,companyId:number){
      // console.log("productId"+this.SplitProductObj.productId);
      this.StockService.getStockWithProdId(this.SplitProductObj.productId).subscribe((data)=>{
        this.fetchstock = data.data;
        // this.updatestock=this.fetchstock;
        console.log("get stock qty atul"+JSON.stringify(this.fetchstock));
      })
    }
    getAllSplitProduct() {
      this.SplitProductService.getAllSplitProduct(this.companyId, this.branchId).subscribe((data) => {
        this.splitProducts = data.data;
      });
    }

     fetchAllProducts(compId: number, branchId: number){
      this.productService.getAllProducts(compId, branchId).subscribe((data) => {
        this.availableProducts = data.data;
      });
    }

    getTheProductForSplit(id:number){
      
      this.enableCreateSplitComp = true;
      this.idForSplitComp = id;

    }
    getTheProductForMerge(id:number){
     
      this.enableCreateMergeComp = true;
      this.idForMergeComp = id;

    }
    addSplitProduct(form: any) {
      this.showForm = true;
      this.SplitProductObj.companyId= this.loginService.getCompnayId();
      this.SplitProductObj.branchId= this.branchId;
      
      this.SplitProductObj.totalQty=this.SplitProductObj.qty*this.SplitProductObj.splitQty;
      this.createproduct.name=this.SplitProductObj.updatedProductName;
      this.createproduct.description="splited product"+`${this.SplitProductObj.productName}`;
      this.createproduct.userId=this.createproduct.userId;
      this.createproduct.sellingPrice=this.SplitProductObj.price;
      this.createproduct.categoryId=this.createproduct.categoryId;
      this.createproduct.tax=this.SplitProductObj.tax;
      this.createproduct.companyId = this.companyId;
      this.createproduct.branchId = this.branchId;
      this.createproduct.unit=this.SplitProductObj.unit;
      this.updatestock.companyId=this.companyId;
      this.updatestock=this.fetchstock;
      this.updatestock.createDate=this.fetchstock.createDate;
      this.updatestock.productId=this.fetchstock.productId;
      this.updatestock.qty=this.fetchstock.qty-this.SplitProductObj.splitQty;
      console.log("this.SplitProductObj.splitQty" +this.SplitProductObj.splitQty)
      console.log("this.updatestock.qty"+this.updatestock.qty);
      console.log("addsplit product"+JSON.stringify(this.SplitProductObj));
      this.productService.addNewProduct(this.createproduct ,this.SplitProductObj.totalQty).subscribe({
        next: (data) => {
          console.log(data.data);
          this.toastrService.success("product has been added with id " + data.data)
          this.updateproductId = data.data
          this.SplitProductObj.updatedProductId=this.updateproductId;
              // alert(JSON.stringify (this.SplitProductObj))
              this.SplitProductService.addSplitProduct(this.SplitProductObj).subscribe({
                next: (data) => {
                  // this.createProduct(data);
                  this.toastrService.success("split is successfully added with id " + data.data)
                  this.getAllSplitProduct();  
                  
                }, error: (err) => {
                  this.toastrService.error("something went wrong")
                }
              }  
              );
        },
        error: (error) => {
          console.log('Error occured ');
  
        }
      });
     
       this.StockService.updateStockWithProdId(this.updatestock.id,this.updatestock).subscribe({
        next: (data) => {
          console.log("stock update "+this.updatestock.id);
          this.toastrService.success("stock updated")
        
        },
        error: (error) => {
          console.log('Error occured ');
    
        }
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
      this.fetchAllProducts(this.compId,this.branchId);
    
    }
    getALLUnit(){
      this.productService.getAllUnit().subscribe(res=>{
        this.Unit =res.data;
      })
    }
    getAllVatRateTypes(){
    
      this.productService.getAllVatRateTypes().subscribe(res => {
        console.log(res.data)
        this.typerate = res.data;
      });
    }

    selectProductId(productName: string ) {
      const product = this.availableProducts.find(p => p.name === productName);
      if (product) {
        this.SplitProductObj.productId = product.id;
        this.SplitProductObj.unit=product.unit;
        this.createproduct.tax =this.SplitProductObj.tax= product.tax;
        this.SplitProductObj.qty=product.qtyPerUnit;
        this.createproduct.categoryId=product.categoryId;
        this.createproduct.userId=product.userId;
        console.log("tax"+this.tax);
        this.getallstock(product.id,product.companyId);
      }

    }
    destroyCreateSplitProductComponent($event:boolean){
      
      if ($event)
     
      this.enableCreateSplitComp = false
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
  
  }
