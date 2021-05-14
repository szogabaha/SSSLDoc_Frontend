import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../login/login.service'
import { catchError, retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { GetAllTicketsResponse } from '../../model/getAllTickets'

@Injectable({
  providedIn: 'root'
})
export class ModeratorServiceService {

  private headers = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get("jwt")) }

  private url = "http://localhost:9000/api/tickets/"
  constructor(private http: HttpClient,
    private cookieService: CookieService) { }

  closeTicket(ticketUuid: string) {
    return this.http.post<any>(this.url + ticketUuid + "/close", null, this.headers).subscribe({
      error: error => console.log("ERROR")
    })
  }

  openTicket(ticketUuid: string) {
    return this.http.post<any>(this.url + ticketUuid + "/open", null, this.headers).subscribe({
      error: error => console.log("ERROR")
    })
  }

  //TODO a backend nyújt status filterezési lehetőséget 
  getAllTickets() {
    return this.http.get<GetAllTicketsResponse>(this.url+"all", this.headers)
  }
}
