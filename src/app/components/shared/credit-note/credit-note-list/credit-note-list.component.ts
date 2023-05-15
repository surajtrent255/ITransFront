import { Component } from '@angular/core';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-credit-note-list',
  templateUrl: './credit-note-list.component.html',
  styleUrls: ['./credit-note-list.component.css'],
})
export class CreditNoteListComponent {
  creditNote!: CreditNote[];
  creditNoteDtails!: CreditNoteDetails[];

  constructor(
    private loginService: LoginService,
    private creditNoteService: CreditNoteService
  ) {}

  ngOnInit() {
    this.getCreditNote();
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
