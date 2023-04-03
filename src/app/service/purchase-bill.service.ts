import { Injectable } from '@angular/core';
import { PurchaseBillMaster } from '../models/PurchaseBillMaster';
import { BASE_URL } from '../constants/urls';
import { RJResponse } from '../models/rjresponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseBill } from '../models/PurchaseBill';

@Injectable({
  providedIn: 'root'
})
export class PurchaseBillService {


  constructor(private http: HttpClient) { }

  createNewPurchaseBill(purchaseBillMasterInfo: PurchaseBillMaster): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/createPurchaseBill`;
    return this.http.post<RJResponse<number>>(url, purchaseBillMasterInfo);
  }

  getAllPurchaseBillByCompId(id: number): Observable<RJResponse<PurchaseBill[]>> {
    let url = `${BASE_URL}/purchaseBill/company?compId=${id}`;
    console.log("***************" + url)

    return this.http.get<RJResponse<PurchaseBill[]>>(url);
  }

}
