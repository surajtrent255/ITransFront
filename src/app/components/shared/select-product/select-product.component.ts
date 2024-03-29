import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css']
})
export class SelectProductComponent {

  title: string = "product";
  @Input() selectMenusForProduct !: Product[];
  @Output() destroySelectProdEmitter = new EventEmitter<boolean>(false);
  @Output() prodSelectEmitter = new EventEmitter<Product>();
  @Output() fetchProductEventEmitter = new EventEmitter<boolean>(false);
  @ViewChild('selectedProductBtn', { static: false })
  selectedProductBtn!: ElementRef;

  @ViewChild("createProductBtn", { static: false }) createProductBtn !: ElementRef;

  createProductEnable: boolean = false;
  showableALertPopup: boolean = true;

  constructor(
    private toastrService: ToastrService
  ) {

  }

  ngOnChanges() {
    setTimeout(() => {
      this.selectedProductBtn?.nativeElement.focus();
    })
    setTimeout(() => {
      this.createProductBtn?.nativeElement.focus();
    })

  }


  destroySelectProduct() {
    this.destroySelectProdEmitter.emit(true);

  }

  disableCreateProduct($event: boolean) {
    this.createProductEnable = false;
  }

  productAdded($event: Product) {
    this.createProductEnable = false;
    this.toastrService.success("Product Has been added ");
    this.setProduct($event)
  }

  setProduct(prod: Product) {

    this.prodSelectEmitter.emit(prod);
    const closeCustomerPopUpEl = document.getElementById("closeSelectProductPop") as HTMLAnchorElement;
    closeCustomerPopUpEl.click();
  }

  onButtonKeyUp(event: KeyboardEvent, prod: Product) {
    if (event.key === 'Enter') {
      this.setProduct(prod)
    }
  }

  displayAddProductPopup() {
    this.createProductEnable = true;
    const createNewProductEl = document.getElementById("createNewProduct") as HTMLButtonElement;
    createNewProductEl.click();
  }


  onButtonKeyUpForDispalyAddProductPopup(event: KeyboardEvent) {
    const eventInputTarget = event.target as HTMLInputElement;
    if (eventInputTarget.name === 'createCustDecs') {
      if (eventInputTarget.value === '1') {
        if (event.key === 'Enter') {
          event.stopPropagation();
          this.showableALertPopup = false;

          this.displayAddProductPopup();
          // this.destroySelectProduct();
        }
      } else {
        if (event.key === 'Enter') {
          this.destroySelectProduct();

        }
      }
    }
  }

  alertYes() {
    this.showableALertPopup = false;
    this.displayAddProductPopup();
  }

  alertNo() {
    this.destroySelectProduct();
  }

}
