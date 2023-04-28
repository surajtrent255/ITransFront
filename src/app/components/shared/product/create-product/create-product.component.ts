import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { Company } from 'src/app/models/company';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SelectCategoryServiceService } from '../../categoryprod/select-category-service.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  @Output() productInfoEvent = new EventEmitter<boolean>();
  product: Product = new Product();
  availableCategories: CategoryProduct[] = [];
  selectedCategory: CategoryProduct = new CategoryProduct;

  constructor(
    private productService: ProductService,
    private categoryProductService: CategoryProductService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private companyService: CompanyServiceService,
    private selectCategoryService: SelectCategoryServiceService,

  ) { }

  compId!: number;
  branchId !: number;
  catSelected: boolean = false;

  customerSearchMethod: number = 1;
  custPhoneOrPan !: number;
  selectMenusForCompanies !: Company[];
  selectMenusForCompaniesSize !: number;
  selectedSellerCompanyId !: number;

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchAllCategories();
  }

  fetchAllCategories() {
    this.categoryProductService
      .getAllCategories(this.compId, this.branchId)
      .subscribe((data) => {
        this.availableCategories = data.data;
      });
  }

  ngAfterViewInit() {
    this.selectCategoryService.selectedCategoryForCatCreationSubject.subscribe((cat) => {
      this.selectedCategory = cat;
      this.product.categoryId = cat.id;
    });
  }

  customerSearch(id: number) {
    this.customerSearchMethod = id;
  }


  fetchCustomerInfo() {
    if (this.custPhoneOrPan === null || this.custPhoneOrPan === undefined) {
      this.toastrService.error(
        `pan or phone`,
        'invalid number'
      );
      return;
      // return;
    }

    this.companyService.getCustomerInfoByPanOrPhone(this.customerSearchMethod, this.custPhoneOrPan).subscribe(({
      next: (data) => {
        this.selectMenusForCompanies = data.data;
        this.selectMenusForCompaniesSize = data.data.length;
      },
      complete: () => {
        const custBtn = document.getElementById("selectCustomer") as HTMLButtonElement;
        custBtn.click();
      }
    }));
  }

  setSellerId(id: number) {
    this.selectedSellerCompanyId = id;
    this.product.sellerId = id;
    const closeCustomerPopUpEl = document.getElementById("closeCustPop") as HTMLAnchorElement;
    closeCustomerPopUpEl.click();
  }


  createProduct(form: any) {
    if (this.product.categoryId === undefined || this.product.categoryId <= 0) {
      this.toastrService.warning("select category");
      return;
    }
    this.product.companyId = this.compId;
    this.product.branchId = this.branchId;
    this.product.userId = this.loginService.currentUser.user.id;
    this.product.sellerId = this.selectedSellerCompanyId;
    this.productService.addNewProduct(this.product).subscribe({
      next: (data) => {
        console.log(data.data);
        this.toastrService.success("product has been added with id " + data.data)

      },
      error: (error) => {
        console.log('Error occured ');

      },
      complete: () => {
        this.productInfoEvent.emit(true);
        this.catSelected = false;
      },
    });
    console.log('product.component.ts');
    form.reset({ tax: 13, discount: 0 });
  }

  customerAdded($event) {
    if ($event === true) {
      this.toastrService.success("Customer Has been added ");
    }
  }

  destroyComp() {
    this.catSelected = false;
  }

  displayMainForm() {
    this.catSelected = true;
  }
}
