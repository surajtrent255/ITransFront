import { Component, ElementRef, ViewChild } from '@angular/core';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';
import { User } from 'src/app/models/user';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-credit-note-invoice-print',
  templateUrl: './credit-note-invoice-print.component.html',
  styleUrls: ['./credit-note-invoice-print.component.css'],
})
export class CreditNoteInvoicePrintComponent {
  year!: string;
  date!: string;
  creditNote!: CreditNote;
  creditNoteDetails!: CreditNoteDetails[];
  user!: string;
  fileName!: string;

  constructor(
    private commonService: CommonService,
    private creditNoteService: CreditNoteService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.commonService.data$.subscribe((res) => {
      this.creditNote = res.printData;

      this.date = this.commonService.formatDate(res.printData.date);
      this.year = new Date().getFullYear().toString();
      console.log(this.year);
      this.creditNoteService
        .getCreditNoteDetails(res.printData.billNumber)
        .subscribe((res) => {
          this.creditNoteDetails = res.data;
          this.fileName = String(
            this.creditNoteDetails[0].serialNumber +
            this.creditNoteDetails[0].billNumber
          );
        });
    });

    this.loginService.userObservable.subscribe((user) => {
      this.user = user.user.firstname + user.user.lastname;
    });
  }

  exportToExcel() {
    this.commonService.convertToExcel('httptrace-table', this.fileName);
  }

  exportToPdf() {
    this.commonService.convertToPdf('httptrace-table', this.fileName);
  }
}
