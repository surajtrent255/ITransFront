import { Component, Renderer2 } from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { RJResponse } from 'src/app/models/rjresponse';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-categoryprod',
  templateUrl: './categoryprod.component.html',
  styleUrls: ['./categoryprod.component.css'],
})
export class CategoryprodComponent {
  categoryProd: CategoryProduct = new CategoryProduct();
  categoriesData: CategoryProduct[] = [];

  compId!: number;
  branchId!: number;

  IsAuditor!: boolean;

  createCategoryShow: boolean = true;
  constructor(
    private categoryProductService: CategoryProductService,
    private loginService: LoginService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchAllCategories();
    let roles = localStorage.getItem('CompanyRoles');
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }
  }

  ngAfterViewInit() {
    const createCatBtn = document.querySelector(
      'createNewCategory'
    ) as HTMLAnchorElement;
    this.renderer.listen(createCatBtn, 'click', () => {
      this.createCategoryShow = true;
    });
  }

  fetchAllCategories() {
    this.categoryProductService
      .getAllCategories(this.compId, this.branchId)
      .subscribe((data) => {
        this.categoriesData = data.data;
        console.log(this.categoriesData);
      });
  }

  addNewCategory() {
    const catCreateDiv = document.getElementById(
      'createCatDiv'
    ) as HTMLDivElement;
    catCreateDiv.removeAttribute('hidden');
  }
  createNewCategory($event: boolean) {
    if (($event = true)) {
      this.fetchAllCategories();
      this.createCategoryShow = true;
    }
  }
}
