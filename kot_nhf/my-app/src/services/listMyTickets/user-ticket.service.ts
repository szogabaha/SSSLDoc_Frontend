import { Injectable } from '@angular/core';
import { RegisteredByMeRequest } from '../../model/RegisteredByMe';
import { Observable, of,  EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserTicketService {

  private url = "http://localhost:9000/api/tickets/"

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getMyTickets() {
      let jwt = this.cookieService.get("jwt")

      if(jwt) {
        let headers = new HttpHeaders().set('Authorization', 'Bearer '+ jwt)
        return this.http.get<RegisteredByMeRequest>(this.url, {headers})
        
      }
      console.log("ERROR")
      return new Observable<RegisteredByMeRequest>()
  }
}
