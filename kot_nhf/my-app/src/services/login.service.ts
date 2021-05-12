import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private schAdminUrl = 'https://auth.sch.bme.hu/site/login?response_type=code&client_id=93632678885928448108&scope=sn+givenName+mail+eduPersonEntitlement'
  private backendLoginEndpoint = 'http://localhost:9000/api/login'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
    ) { }

  getSchAccessToken() {
    window.location.href = this.schAdminUrl
  }

  getBackendJwt(schAuthAccessToken : string) {
    return this.http.post<any>(this.backendLoginEndpoint + "?authorizationCode="+schAuthAccessToken, null).subscribe({
      next: data => {
        this.cookieService.delete("jwt")
        this.cookieService.set("jwt", data.jwt)
        console.log("JWT:" + data.jwt)
      },
      error: error =>{
        //TODO
        console.error('There was an error', error);
      }
    })
  }
  
}
