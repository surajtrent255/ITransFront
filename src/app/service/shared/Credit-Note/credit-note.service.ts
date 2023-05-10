import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CREDIT_NOTE } from 'src/app/constants/urls';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';

@Injectable({
  providedIn: 'root',
})
export class CreditNoteService {
  constructor(private http: HttpClient, private ToastrService: ToastrService) {}

  addCreditNote(creditNote: CreditNote): Observable<any> {
    return this.http.post(CREDIT_NOTE, creditNote).pipe(
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

  addCreditNoteDetails(creditNoteDetails: CreditNoteDetails): Observable<any> {
    return this.http.post(`${CREDIT_NOTE}/details`, creditNoteDetails).pipe(
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
