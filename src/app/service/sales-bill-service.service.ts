import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { BASE_URL } from '../constants/urls';
import { RJResponse } from '../models/rjresponse';
import { SalesBill } from '../models/SalesBill';
import { SalesBillDetail } from '../models/SalesBillDetail';
import { SalesBillInvoice } from '../models/SalesBillInvoice';
import { SalesBillMaster } from '../models/SalesBillMaster';

@Injectable({
  providedIn: 'root'
})
export class SalesBillServiceService {


  constructor(private http: HttpClient) { }

  getAllSalesBill(id: number): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/salesBill/company?compId=${id}`;
    return this.http.get<RJResponse<SalesBill[]>>(url);
  }


  createNewSalesBill(salesBillMasterInfo: SalesBillMaster): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/createSalesBill`;
    return this.http.post<RJResponse<number>>(url, salesBillMasterInfo);
  }

  fetchSalesBillDetailForInvoice(billId: number): Observable<RJResponse<SalesBillInvoice>> {
    let url = `${BASE_URL}/salesBillDetail?billId=${billId}`;
    return this.http.get<RJResponse<SalesBillInvoice>>(url);
  }

  printTheBill(billNo: string, printerId: number): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/salesBill/print/${billNo}`;
    console.log("print url = " + url)
    return this.http.post<RJResponse<number>>(url, { "printerId": printerId });
  }
}
