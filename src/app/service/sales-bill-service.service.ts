import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { BASE_URL } from '../constants/urls';
import { RJResponse } from '../models/rjresponse';
import { SalesBill } from '../models/SalesBill';
import { SalesBillDetail } from '../models/SalesBillDetail';
import { SalesBillMaster } from '../models/SalesBillMaster';

@Injectable({
  providedIn: 'root'
})
export class SalesBillServiceService {


  constructor(private http: HttpClient) { }

  getAllSalesBill(): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/salesBill`;
    return this.http.get<RJResponse<SalesBill[]>>(url);
  }


  createNewSalesBill(salesBillMasterInfo: SalesBillMaster): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/createSalesBill`;
    return this.http.post<RJResponse<number>>(url, salesBillMasterInfo);
  }

  fetchSalesBillDetailForInvoice(billId: number, compId: number): Observable<RJResponse<SalesBillMaster>> {
    let url = `${BASE_URL}/salesBillDetail?billId=${billId}&comapnyId=${compId}`;
    return this.http.get<RJResponse<SalesBillMaster>>(url);
  }

  printTheBill(billNo: number, printerId: number): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/salesBill/print/${billNo}`;
    console.log("print url = " + url)
    return this.http.post<RJResponse<number>>(url, { "printerId": printerId });
  }
}
