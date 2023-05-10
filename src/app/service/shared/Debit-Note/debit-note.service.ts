import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DEBIT_NOTE } from 'src/app/constants/urls';
import { DebitNote } from 'src/app/models/Debit-Note/debitNote';
import { DebitNoteDetails } from 'src/app/models/Debit-Note/debitNoteDetails';

@Injectable({
  providedIn: 'root',
})
export class DebitNoteService {
  constructor(private http: HttpClient, private ToastrService: ToastrService) {}

  addDebitNote(debitNote: DebitNote): Observable<any> {
    return this.http.post(DEBIT_NOTE, debitNote).pipe(
      tap({
        next: (res) => {
          this.ToastrService.success('Successfully Added');
        },
        error: (err) => {
          this.ToastrService.error(err);
        },
      })
    );
  }

  addDebitNoteDetails(debitNotedetails: DebitNoteDetails): Observable<any> {
    return this.http.post(`${DEBIT_NOTE}/details`, debitNotedetails).pipe(
      tap({
        next: (res) => {
          this.ToastrService.success('Successfully Added');
        },
        error: (err) => {
          this.ToastrService.error(err);
        },
      })
    );
  }
}
