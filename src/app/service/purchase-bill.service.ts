import { Injectable } from '@angular/core';
import { PurchaseBillMaster } from '../models/PurchaseBillMaster';
import { BASE_URL } from '../constants/urls';
import { RJResponse } from '../models/rjresponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseBill } from '../models/PurchaseBill';
import { PurchaseBillInvoice } from '../models/PurchaseBillInvoice';

@Injectable({
  providedIn: 'root'
})
export class PurchaseBillService {


  constructor(private http: HttpClient) { }

  createNewPurchaseBill(purchaseBillMasterInfo: PurchaseBillMaster): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/createPurchaseBill`;
    return this.http.post<RJResponse<number>>(url, purchaseBillMasterInfo);
  }

  getAllPurchaseBillByCompId(id: number, branchId: number): Observable<RJResponse<PurchaseBill[]>> {
    let url = `${BASE_URL}/purchaseBill/company?compId=${id}&branchId=${branchId}`;
    return this.http.get<RJResponse<PurchaseBill[]>>(url);
  }

  fetchPurchaseBillDetailForInvoice(billId: number, compId: number, branchId: number): Observable<RJResponse<PurchaseBillInvoice>> {
    let url = `${BASE_URL}/purchaseBillDetail?billId=${billId}&comapnyId=${compId}&branchId=${branchId}`;
    console.log(url)
    return this.http.get<RJResponse<PurchaseBillInvoice>>(url);
  }

}
