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

  getAllSalesBill(id: number, branchId: number): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/salesBill/company?compId=${id}&branchId=${branchId}`;
    return this.http.get<RJResponse<SalesBill[]>>(url);
  }

  getLimitedSalesBill(offset: number, pageTotalItems: number, searchBy: string, searchWildCard: string, sortBy: string, compId: number, branchId: number): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/salesBill/company/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&searchBy=${searchBy}&searchWildCard=${searchWildCard}&sortBy=${sortBy}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<SalesBill[]>>(url);
  }

  createNewSalesBill(salesBillMasterInfo: SalesBillMaster): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/createSalesBill`;
    return this.http.post<RJResponse<number>>(url, salesBillMasterInfo);
  }

  getBillDetailById(billId: number): Observable<RJResponse<SalesBillDetail[]>> {
    let url = `${BASE_URL}/salesBillDetail/getByBillId?billId=${billId}`;
    return this.http.get<RJResponse<SalesBillDetail[]>>(url);


  }
  fetchSalesBillDetailForInvoice(billId: number): Observable<RJResponse<SalesBillInvoice>> {
    let url = `${BASE_URL}/salesBillDetail?billId=${billId}`;
    return this.http.get<RJResponse<SalesBillInvoice>>(url);
  }

  printTheBill(billId: number, printerId: number): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/salesBill/print/${billId}`;
    console.log("print url = " + url)
    return this.http.post<RJResponse<number>>(url, { "printerId": printerId });
  }

  approveTheBill(id: number) {
    let url = `${BASE_URL}/salesBill/approve/${id}`;
    return this.http.post<RJResponse<number>>(url, {});
  }

  cancelTheBill(id: number) {
    let url = `${BASE_URL}/salesBill/${id}`;
    return this.http.delete(url);
  }
}
