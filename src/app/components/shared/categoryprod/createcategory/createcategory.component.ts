import {
  Component,
  EventEmitter,
  Output,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { RJResponse } from 'src/app/models/rjresponse';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SelectCategoryServiceService } from '../select-category-service.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-createcategory',
  templateUrl: './createcategory.component.html',
  styleUrls: ['./createcategory.component.css'],
})
export class CreatecategoryComponent {
  @Output() categorySuccessInfoEvent = new EventEmitter<boolean>();
  @Output() disbaleShowCreateCategory = new EventEmitter<boolean>(false);
  categoryProd: CategoryProduct = new CategoryProduct();
  categoriesData: CategoryProduct[] = [];

  selectedCategory: CategoryProduct = new CategoryProduct();
  catSelected: boolean = false;
  companyId!: number;
  branchId!: number;
  title = 'TreeProj';

  constructor(
    private categoryProductService: CategoryProductService,
    private loginService: LoginService,
    private selectCategoryService: SelectCategoryServiceService,
    private tostrService: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchAllCategories();
  }

  ngAfterViewInit() {
    this.selectCategoryService.selectedCategoryForCatCreationSubject.subscribe(
      (cat) => (this.selectedCategory = cat)
    );
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

  displayMainForm() {
    this.catSelected = true;
  }

  createCategoryProd(createCategoryProdForm: any) {
    this.categoryProd.companyId = this.companyId;
    this.categoryProd.branchId = this.branchId;
    this.categoryProd.parentId = this.selectedCategory.id;
    this.selectedCategory = new CategoryProduct();
    this.categoryProd.userId = this.loginService.currentUser.user.id;
    this.selectCategoryService.resetSelectedCategoryForCatCreation();

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
        this.tostrService.success('successfull addded ');
        const createNewCatEl = document.getElementById(
          'createNewCat'
        ) as HTMLAnchorElement;
        createNewCatEl.click();
        this.catSelected = false;
      },
    });
  }

  selectTheCategory($event: number) {
    // this.catSelected = true;
    // this.selectedCategory = $event;
    this.categoryProd.parentId = $event;
  }

  destroyComp() {
    this.catSelected = false;
    this.disbaleShowCreateCategory.emit(true);
    this.selectCategoryService.resetSelectedCategoryForCatCreation();
  }
}
