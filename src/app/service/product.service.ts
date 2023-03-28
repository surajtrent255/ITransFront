import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/urls';
import { Product } from '../models/Product';
import { RJResponse } from '../models/rjresponse';
const productURL = "product"

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  constructor(private httpClient: HttpClient) { }

  addNewProduct(product: Product): Observable<any> {
    let url = `${BASE_URL}/${productURL}`;
    return this.httpClient.post(url, product);
  }

  getAllProducts(): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/${productURL}`;
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getProductById(id: number): Observable<RJResponse<Product>> {
    let url = `${BASE_URL}/product/${id}`;
    return this.httpClient.get<RJResponse<Product>>(url);
  }
}
