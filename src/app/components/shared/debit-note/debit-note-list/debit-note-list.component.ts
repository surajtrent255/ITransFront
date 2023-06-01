import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DebitNote } from 'src/app/models/Debit-Note/debitNote';
import { DebitNoteDetails } from 'src/app/models/Debit-Note/debitNoteDetails';
import { DebitNoteService } from 'src/app/service/shared/Debit-Note/debit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-debit-note-list',
  templateUrl: './debit-note-list.component.html',
  styleUrls: ['./debit-note-list.component.css'],
})
export class DebitNoteListComponent {
  debitNote!: DebitNote[];
  debitNoteDetails!: DebitNoteDetails[];

  IsAuditor!: boolean;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  constructor(
    private debitNoteService: DebitNoteService,
    private loginService: LoginService,
    private commonService: CommonService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getDebitNote();

    let roles = localStorage.getItem('CompanyRoles');
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }
  }

  getDebitNote() {
    this.debitNoteService
      .getDebitNotes(
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.debitNote = res.data;
      });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedDebitNotes();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedDebitNotes();
    }
  }

  fetchLimitedDebitNotes() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.debitNoteService
      .getLimitedDebitNotes(
        offset,
        this.pageTotalItems,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('bills not found ');
          this.currentPageNumber -= 1;
        } else {
          this.debitNote = res.data;
        }
      });
  }

  details(billNumber: number) {
    this.debitNoteService.getDebitNoteDetails(billNumber).subscribe((res) => {
      this.debitNoteDetails = res.data;
    });
  }
}
