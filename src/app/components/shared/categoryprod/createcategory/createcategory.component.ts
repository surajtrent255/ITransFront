import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { RJResponse } from 'src/app/models/rjresponse';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-createcategory',
  templateUrl: './createcategory.component.html',
  styleUrls: ['./createcategory.component.css'],
})
export class CreatecategoryComponent {
  @Output() categorySuccessInfoEvent = new EventEmitter<boolean>();
  categoryProd: CategoryProduct = new CategoryProduct();
  categoriesData: CategoryProduct[] = [];

  companyId!: number;
  branchId !: number;
  constructor(
    private categoryProductService: CategoryProductService,
    private loginService: LoginService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchAllCategories();
  }

  fetchAllCategories() {
    this.categoryProductService
      .getAllCategories(this.companyId, this.branchId)
      .subscribe((data) => {
        this.categoriesData = data.data;
      });
  }

  addNewCategory() {
    const catCreateDiv = document.getElementById(
      'createCatDiv'
    ) as HTMLDivElement;
    catCreateDiv.removeAttribute('hidden');
  }

  createCategoryProd(createCategoryProdForm: any) {
    this.categoryProd.companyId = this.companyId;
    this.categoryProd.branchId = this.branchId;
    this.categoryProd.userId = this.loginService.currentUser.user.id;
    this.categoryProductService.addNewCategory(this.categoryProd).subscribe({
      next: (data: RJResponse<number>) => {
        createCategoryProdForm.reset();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        createCategoryProdForm.reset();
        this.fetchAllCategories();
        this.categorySuccessInfoEvent.emit(true);
        this.toastrService.success("category is successfully deleted ");
      },
    });
  }
}
