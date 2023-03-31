import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/constants/urls';
import { RJResponse } from 'src/app/models/rjresponse';
import { Stock } from 'src/app/models/Stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private httpClient: HttpClient) { }

  getStockWithProdIdAndCompanyId(prodId: number, compId: number): Observable<RJResponse<Stock>> {
    let url = `${BASE_URL}/stock?prodId=${prodId}&compId=${compId}`;
    return this.httpClient.get<RJResponse<Stock>>(url);
  }

  updateStockWithProdIdAndCompanyId(stock: Stock) {
    let url = `${BASE_URL}/stock`;
    return this.httpClient.put(url, stock);
  }

}
