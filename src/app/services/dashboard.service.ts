import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { AdapterHView, AdapterH, ADAPTERI, AdapterItemRule, AdapterTypeWithItem } from 'app/models/icon.models';
import { InvoiceDetails } from 'app/models/invoice-details';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseAddress: string;
  NotificationEvent: Subject<any>;

  GetNotification(): Observable<any> {
    return this.NotificationEvent.asObservable();
  }

  TriggerNotification(eventName: string): void {
    this.NotificationEvent.next(eventName);
  }

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    this.NotificationEvent = new Subject();
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  GetAllInvoiceDetails(): Observable<InvoiceDetails[] | string> {
    return this._httpClient
        .get<InvoiceDetails[]>(
            `${this.baseAddress}api/Invoice/GetAllEInvoiceDetails`
        )
        .pipe(catchError(this.errorHandler));
}
GenerateIrnDetails(ID: number): Observable<InvoiceDetails | string> {
  return this._httpClient.get<InvoiceDetails>(`${this.baseAddress}api/Invoice/GenerateIrnDetails?ID=${ID}`)
    .pipe(catchError(this.errorHandler));
}
CancelIrnDetails(ID: number,CancelReason:string,CancelReasonRemark:string): Observable<InvoiceDetails | string> {
  return this._httpClient.get<InvoiceDetails>(`${this.baseAddress}api/Invoice/CancelIrnDetails?ID=${ID}&CancelReason=${CancelReason}&CancelReasonRemark=${CancelReasonRemark}`)
    .pipe(catchError(this.errorHandler));
}
DowloandPdfFromID(ID: number): Observable<Blob | string> {
  return this._httpClient.get(`${this.baseAddress}api/Invoice/DowloandPdfFromID?ID=${ID}`, {
    responseType: 'blob',
    headers: new HttpHeaders().append('Content-Type', 'application/json')
  })
    .pipe(catchError(this.errorHandler));
}
}
