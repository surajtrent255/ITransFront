import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { GET_FIXED_ASSETS_DETAILS } from 'src/app/constants/urls';
import { FixedAssets } from 'src/app/models/Fixed Assets/FixedAssets';

@Injectable({
  providedIn: 'root',
})
export class FixedAssetsService {
  constructor(
    private http: HttpClient,
    private toastrSerivice: ToastrService
  ) {}

  getFixedAssetsDetails(compayId: number): Observable<any> {
    return this.http.get(`${GET_FIXED_ASSETS_DETAILS}?companyId=${compayId}`);
  }

  getFixedAssetsDetailsBySN(SN: number): Observable<any> {
    return this.http.get(`${GET_FIXED_ASSETS_DETAILS}/${SN}`);
  }

  updateFixedAssetsDetails(FixedAssets: FixedAssets): Observable<any> {
    return this.http.put(GET_FIXED_ASSETS_DETAILS, FixedAssets);
  }

  addFixedAssetDetails(fixedAssets: FixedAssets): Observable<any> {
    return this.http.post(GET_FIXED_ASSETS_DETAILS, fixedAssets).pipe(
      tap({
        next: (res) => {
          this.toastrSerivice.success(res.toString());
        },
        error: (err) => {
          this.toastrSerivice.error('Error Occured' + err);
        },
      })
    );
  }

  deleteFixedDetails(SN: number) {
    return this.http.delete(`${GET_FIXED_ASSETS_DETAILS}/${SN}`);
  }
}
