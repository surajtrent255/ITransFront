import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/urls';
import { CategoryProduct } from '../models/CategoryProduct';
import { RJResponse } from '../models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryProductService {
  constructor(private http: HttpClient) { }

  getAllCategories(compId: number, branchId: number): Observable<RJResponse<CategoryProduct[]>> {
    let url = `${BASE_URL}/category/all?compId=${compId}&branchId=${branchId}`;
    console.log(url);
    return this.http.get<RJResponse<CategoryProduct[]>>(url);
  }

  addNewCategory(category: CategoryProduct): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/category`;
    return this.http.post<RJResponse<number>>(url, category);
  }

  deleteCategory(id: number, compId: number, branchId: number) {
    let url = `${BASE_URL}/category/${id}?compId=${compId}&branchId=${branchId}`;
    return this.http.delete(url);
  }
}
