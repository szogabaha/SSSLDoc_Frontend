import { Injectable } from '@angular/core';
import { RegisteredByMeRequest } from '../../model/RegisteredByMe';
import { Observable, of,  EMPTY, ObservableInput, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CreateNewTicketRequest } from '../../model/CreateNewTicketRequest'
import { catchError, retry } from 'rxjs/operators';

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

  getMyTickets() {
      let jwt = this.cookieService.get("jwt")

      if(jwt) {
        return this.http.get<RegisteredByMeRequest>(this.url, this.headers)
        
      }
      console.log("ERROR")
      return new Observable<RegisteredByMeRequest>()
  }


  createNewTickets(request: CreateNewTicketRequest) {
        return this.http.post<any>(this.url, request, this.headers)
        .pipe(
          catchError(this.handleError)
        );
  }

  handleError(error: HttpErrorResponse) {
    console.log("error")

    return throwError("something bad happened")
  }
}
