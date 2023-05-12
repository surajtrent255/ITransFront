import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent {
  title = " product search ";
  selectMenusForProduct !: Product[];

  constructor(
    private toastrService: ToastrService
  ) {

  }

  onButtonKeyUp(event: KeyboardEvent, prod: Product) {
    if (event.key === 'Enter') {
      
    }
  }















}
