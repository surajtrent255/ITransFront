import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-credit-note-list',
  templateUrl: './credit-note-list.component.html',
  styleUrls: ['./credit-note-list.component.css'],
})
export class CreditNoteListComponent {
  creditNote!: CreditNote[];
  creditNoteDtails!: CreditNoteDetails[];

  IsAuditor!: boolean;

  constructor(
    private loginService: LoginService,
    private creditNoteService: CreditNoteService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCreditNote();

    let roles = localStorage.getItem('CompanyRoles');
    if (roles?.includes('AUDITOR')) {
      this.IsAuditor = false;
    } else {
      this.IsAuditor = true;
    }
  }

  printData(printData: CreditNote) {
    this.commonService.setData({
      printData,
    });
    this.router.navigateByUrl('/dashboard/print-credit-note');
  }

  getCreditNote() {
    this.creditNoteService
      .getCreditNote(
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.creditNote = res.data;
      });
  }

  details(billNumber: string) {
    this.creditNoteService.getCreditNoteDetails(billNumber).subscribe((res) => {
      this.creditNoteDtails = res.data;
    });
  }
}
