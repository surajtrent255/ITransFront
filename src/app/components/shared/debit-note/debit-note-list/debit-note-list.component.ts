import { Component } from '@angular/core';
import { DebitNote } from 'src/app/models/Debit-Note/debitNote';
import { DebitNoteDetails } from 'src/app/models/Debit-Note/debitNoteDetails';
import { DebitNoteService } from 'src/app/service/shared/Debit-Note/debit-note.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-debit-note-list',
  templateUrl: './debit-note-list.component.html',
  styleUrls: ['./debit-note-list.component.css'],
})
export class DebitNoteListComponent {
  debitNote!: DebitNote[];
  debitNoteDetails!: DebitNoteDetails[];

  constructor(
    private debitNoteService: DebitNoteService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.getDebitNote();
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
  details(billNumber: number) {
    this.debitNoteService.getDebitNoteDetails(billNumber).subscribe((res) => {
      this.debitNoteDetails = res.data;
    });
  }
}
