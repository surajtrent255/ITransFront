import { Component } from '@angular/core';
import { MergeProduct } from 'src/app/models/MergeProduct';
import { LoginService } from 'src/app/service/shared/login.service';
import{MergeProductService} from'src/app/service/shared/MergeProduct/merge-product.service';
import { ToastrService } from 'ngx-toastr';
import {SplitProductService} from 'src/app/service/shared/SplitProduct/split-product.service'
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
  styleUrls: ['./merge-product.component.css']
})
export class MergeProductComponent {
  
  
 
constructor( private toastrService: ToastrService, 
              private loginService: LoginService,
              private mergeProductService: MergeProductService,
 
  ){}
ngOnInit() {
  

  }
 

}


