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

  //TODO filtering can also be done by the Backend, it would also be amore optimal solution.
  getAllTickets() {
    return this.http.get<GetAllTicketsResponse>(this.url+"all", this.headers)
  }

  //Assign ticket to the user. This service part is working fine, but we cannot use it yet as we do not know, who we can assign the tickets to
  assign(messageUuid: string, userUuid: string) {
    return this.http.post(this.url + messageUuid + "assign" + userUuid, null, this.headers).subscribe({
      error: error => console.log("ERROR")
    })
  }

  //Unassign ticket to the user. This service part is working fine, but we cannot use it yet as we do not know, who we can assign the tickets to
  unassign(messageUuid: string) {
    return this.http.post(this.url + messageUuid + "/unassign", null, this.headers).subscribe({
      error: error => console.log("ERROR")
    })
  }
}
