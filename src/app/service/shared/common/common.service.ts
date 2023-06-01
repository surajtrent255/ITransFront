import { ElementRef, Injectable } from '@angular/core';
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

  // for dragable popup
  private popup!: HTMLElement;
  private offsetX!: number;
  private offsetY!: number;
  private initialX!: number;
  private initialY!: number;

  dragablePopUp(popupElement: HTMLElement) {
    this.popup = popupElement;
    const popupHeader = this.popup.querySelector('.popupHeading');
    if (popupHeader) {
      popupHeader.addEventListener('mousedown' as any, this.startDrag);
    }
  }

  startDrag = (e: MouseEvent) => {
    e.preventDefault();
    this.offsetX = e.clientX;
    this.offsetY = e.clientY;
    this.initialX = this.popup.offsetLeft;
    this.initialY = this.popup.offsetTop;
    document.addEventListener('mousemove', this.dragPopup);
    document.addEventListener('mouseup', this.stopDrag);
  };

  dragPopup = (e: MouseEvent) => {
    e.preventDefault();
    const dx = e.clientX - this.offsetX;
    const dy = e.clientY - this.offsetY;
    this.popup.style.left = this.initialX + dx + 'px';
    this.popup.style.top = this.initialY + dy + 'px';
  };

  stopDrag = () => {
    document.removeEventListener('mousemove', this.dragPopup);
    document.removeEventListener('mouseup', this.stopDrag);
  };
}
