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
          //TODO
          console.error('There was an error', error);
        }
      })

      
     
    })
  }

  public pressLogin() {
    this.loginService.getSchAccessToken()
  }
}
