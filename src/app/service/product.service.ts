import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/urls';
import { InventoryProducts } from '../models/InventoryProducts';
import { Product } from '../models/Product';
import { RJResponse } from '../models/rjresponse';
const productURL = 'product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  addNewProduct(product: Product): Observable<any> {
    let url = `${BASE_URL}/${productURL}`;
    return this.httpClient.post(url, product);
  }

  getAllProducts(): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/${productURL}`;
    return this.httpClient.get<RJResponse<Product[]>>(
      'http://localhost:9999/product'
    );
  }

  getProductById(id: number): Observable<RJResponse<Product>> {
    let url = `${BASE_URL}/product/${id}`;
    console.log(url);
    return this.httpClient.get<RJResponse<Product>>(url);
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
}
