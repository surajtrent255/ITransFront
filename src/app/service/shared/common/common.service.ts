import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as html2pdf from 'html2pdf.js';
import { utils, writeFile } from 'xlsx';
import * as CryptoJS from 'crypto-js';

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

  // // Encrypt function
  // encryptObject(obj: any): string {
  //   const jsonString = JSON.stringify(obj);
  //   const encryptedData = CryptoJS.AES.encrypt(
  //     jsonString,
  //     'mySecretKey'
  //   ).toString();
  //   return encryptedData;
  // }

  // // Decrypt function
  // decryptObject(encryptedData: string): any {
  //   const decryptedData = CryptoJS.AES.decrypt(
  //     encryptedData,
  //     'mySecretKey'
  //   ).toString(CryptoJS.enc.Utf8);
  //   const obj = JSON.parse(decryptedData);
  //   return obj;
  // }

  private key = CryptoJS.enc.Utf8.parse(1203199320052021);
  private iv = CryptoJS.enc.Utf8.parse(1203199320052021);

  encryptUsingAES256(data): any {
    const jsonString = JSON.stringify(data);

    var encrypted = CryptoJS.AES.encrypt(jsonString, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  }

  decryptUsingAES256(decString) {
    try {
      var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);

      const obj = JSON.parse(decrypted);
      return obj;
    } catch (error) {
      console.error('Error during decryption:', error);
      return null;
    }
  }
}
