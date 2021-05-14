import { Injectable } from '@angular/core';
import { RegisteredByMeRequest } from '../../model/RegisteredByMe';
import { Observable, of,  EMPTY, ObservableInput, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CreateNewTicketRequest } from '../../model/CreateNewTicketRequest'
import { catchError, retry } from 'rxjs/operators';
import { TicketDetail } from '../../model/TicketDetail'
import { AddMessageRequest } from '../../model/AddMessageRequest'

@Injectable({
  providedIn: 'root'
})


export class UserTicketService {


  private url = "http://localhost:9000/api/tickets/"
  private headers = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '
                                      + this.cookieService.get("jwt")
                                    )}

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  //Get the tickets made by us. If the jwt is not stored, we return an empty list.
  getMyTickets() {
      let jwt = this.cookieService.get("jwt")
      if(jwt) {
        return this.http.get<RegisteredByMeRequest>(this.url, this.headers)
      }
      console.log("ERROR")
      return new Observable<RegisteredByMeRequest>()
  }


  createNewTicket(request: CreateNewTicketRequest) {
        return this.http.post<any>(this.url, request, this.headers)
        .pipe(
          catchError(this.handleError)
        );
  }

  getTicketByUuid(uuid: string) {
      return this.http.get<TicketDetail>(this.url+"/"+uuid, this.headers)
      .pipe(
        catchError(this.handleError)
      )
    }

  addMessageTo(ticketUuid: string, request: AddMessageRequest) {
    return this.http.post<any>(this.url + "/" + ticketUuid + "/messages", request, this.headers)    
  }


  //This could delegate the error to the errorservice. It is not implemented as we first want to further improve it (by showing the error message) 
  private handleError(error: HttpErrorResponse) {
    return throwError("something bad happened")
  }
}
