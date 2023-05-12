import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/urls';
import { InventoryProducts } from '../models/InventoryProducts';
import { Product } from '../models/Product';
import { RJResponse } from '../models/rjresponse';
import { VatRateTypes } from '../models/VatRateTypes';
import { Unit } from '../models/Unit';
const productURL = 'product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) { }

  addNewProduct(product: Product, totalQty: number): Observable<any> {
    let url = `${BASE_URL}/${productURL}?stockqty=${totalQty}`;
    return this.httpClient.post(url, product);
  }

  getAllProducts(compId: number, branchId: number): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/${productURL}?compId=${compId}&branchId=${branchId}`;
    console.log('url  = ' + url);
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getProductById(
    id: number,
    compId: number,
    branchId: number,
    searchByBarCode: boolean
  ): Observable<RJResponse<Product>> {
    let url = `${BASE_URL}/product/${id}?compId=${compId}&branchId=${branchId}&searchByBarCode=${searchByBarCode}`;
    return this.httpClient.get<RJResponse<Product>>(url);
  }

  getProductByWildCardName(name: string, compId: number, branchId: number): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/product/searchByWildCard?name=${name}&compId=${compId}&branchId=${branchId}`;
    console.log(url);
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getProductForSearch( compId: number, branchId: number ,search:string): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/product/search?compId=${compId}&branchId=${branchId}&search=${search}`;
    console.log(url);
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getAllProductsForInventory(
    companyId: number
  ): Observable<RJResponse<InventoryProducts[]>> {
    let url = `${BASE_URL}/${productURL}/inventory?companyId=${companyId}`;
    return this.httpClient.get<RJResponse<InventoryProducts[]>>(url);
  }

  editProduct(productInfo: Product) {
    let url = `${BASE_URL}/${productURL}/${productInfo.id}`;
    return this.httpClient.put(url, productInfo);
  }

  deleteProductById(id: number) {
    let url = `${BASE_URL}/product/${id}`;
    return this.httpClient.delete(url);
  }

  getProductsByProductIds(productsIds: number[]): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/product/getProductsByIds?productsIds=${productsIds}`;
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }


  getAllVatRateTypes(): Observable<RJResponse<VatRateTypes[]>> {

    let url = `${BASE_URL}/vatRateType`;
    // console.log("url = " + url)
    // console.log(this.httpClient.get<RJResponse<VatRateTypes[]>>(url));
    return this.httpClient.get<RJResponse<VatRateTypes[]>>(url);

  }
  getAllUnit(): Observable<RJResponse<Unit[]>> {
    let url = `${BASE_URL}/unit`;
    return this.httpClient.get<RJResponse<Unit[]>>(url);

  }
}
