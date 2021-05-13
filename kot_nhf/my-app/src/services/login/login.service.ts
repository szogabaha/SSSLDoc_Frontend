import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private schAdminUrl = 'https://auth.sch.bme.hu/site/login?response_type=code&client_id=93632678885928448108&scope=sn+givenName+mail+eduPersonEntitlement'
  private backendLoginEndpoint = 'http://localhost:9000/api/login'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
    ) { }

  getSchAccessToken() {
    window.location.href = this.schAdminUrl
  }

  getBackendJwt(schAuthAccessToken : string) {
    return this.http.post<any>(this.backendLoginEndpoint + "?authorizationCode="+schAuthAccessToken, null)
  }

  logout() {
    this.cookieService.delete("jwt")
    this.router.navigate(['login'])
  }

  checkJwtEstablished() {
    let jwt = this.cookieService.get("jwt")
    if (!jwt) {
      this.logout()
    }
  }
  
}
