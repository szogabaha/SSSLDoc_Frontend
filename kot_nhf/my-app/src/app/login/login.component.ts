import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService : LoginService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router,
              private cookieService: CookieService) { }

  ngOnInit(): void {
    //This is where we get redirected after logging in to Auth.SCH. We're directing the user to the 'tickets' route from here if the login was successful.
    this.activatedRoute.queryParams.subscribe(params =>{
      var schAuthAccessToken = params['code']
      if (!schAuthAccessToken){
        return
      }

      console.log(schAuthAccessToken)
      this.loginService.getBackendJwt(schAuthAccessToken).subscribe({
        next: data => {
          this.cookieService.set("jwt", data.jwt)
          this.router.navigate(['tickets'])
        },
        error: error =>{
          //TODO we did not use the errorservice here as we want to further improve this part first
          console.error('There was an error', error);
        }
      })

      
     
    })
  }

  public pressLogin() {
    this.loginService.getSchAccessToken()
  }
}
