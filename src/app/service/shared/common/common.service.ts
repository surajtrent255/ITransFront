import { Injectable } from '@angular/core';
import { RoleService } from '../role.service';
import { LoginService } from '../login.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  setData(data: any) {
    console.log('Setting data:', data);
    this.dataSubject.next(data);
  }

  clearData() {
    this.dataSubject.next(null);
  }

  // for millisecond to date (UTC Nepal)
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = this.addZeroPadding(date.getMonth() + 1);
    const day = this.addZeroPadding(date.getDate());
    return `${year}-${month}-${day}`;
  }

  addZeroPadding(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
