import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'
import { ModeratorServiceService} from '../moderator/moderator-service.service'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private schAdminUrl = 'https://auth.sch.bme.hu/site/login?response_type=code&client_id=93632678885928448108&scope=sn+givenName+mail+eduPersonEntitlement'
  private backendLoginEndpoint = 'http://localhost:9000/api/login'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private moderatorService: ModeratorServiceService
    ) { }

  //Redirect ourselves to an outer source
  getSchAccessToken() {
    window.location.href = this.schAdminUrl
  }

  //After getting redirected to the page with an accesToken (more like an accesCode), we can have our jwt established
  getBackendJwt(schAuthAccessToken : string) {
    return this.http.post<any>(this.backendLoginEndpoint + "?authorizationCode="+schAuthAccessToken, null)
  }

  //Logging out from the application. We are not perfectly sure if this is the most secure solution
  logout() {
    this.cookieService.delete("jwt")
    this.router.navigate(['login'])
  }

  //Validate if we have a jwt created. If not we return to the part of the application, where we can request it.
  checkJwtEstablished() {
    let jwt = this.cookieService.get("jwt")
    if (!jwt) {
      this.logout()
    }
  }

  //This is a simple delegation to avoid violation of law of demeter
  getJwt() {
    return this.cookieService.get("jwt")
  }

  //This is a part of the service which we really need but the backend does not provide it. At this moment, we cannot use this.
  getAuthorizationLevel() {
    return AuthorizationLevel.Admin
  }
}

//Same goes for this
enum AuthorizationLevel {
  User,
  Clerk,
  Admin
}
