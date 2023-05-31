import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as html2pdf from 'html2pdf.js';
import { utils, writeFile } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() { }

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

  // html to pdf conversion
  convertToPdf(elementId: string, fileName: string) {
    const element = document.getElementById(elementId);
    const options = {
      filename: `${fileName}.pdf`,
      margin: [10, 10],
      orientation: 'landscape',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    };

    html2pdf().set(options).from(element).save();
  }

  // html to Excel conversion
  convertToExcel(elementId: string, fileName: string) {
    const htmlContent = document.getElementById(elementId)?.outerHTML;

    if (htmlContent) {
      const tempTable = document.createElement('table');
      tempTable.innerHTML = htmlContent;

      const worksheet = utils.table_to_sheet(tempTable);
      const workbook = {
        Sheets: { Sheet1: worksheet },
        SheetNames: ['Sheet1'],
      };

      writeFile(workbook, `${fileName}.xlsx`, {
        bookType: 'xlsx',
        type: 'array',
      });
    }
  }
}
