import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/urls';
import { CategoryProduct } from '../models/CategoryProduct';
import { RJResponse } from '../models/rjresponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryProductService {

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<RJResponse<CategoryProduct[]>> {
    let url = `${BASE_URL}/category/all`;
    return this.http.get<RJResponse<CategoryProduct[]>>(url);
  }

}
