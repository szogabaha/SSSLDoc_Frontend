import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService : LoginService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params =>{
      var schAuthAccessToken = params['code']
      if (!schAuthAccessToken){
        return
      }

      console.log(schAuthAccessToken)
      if(this.loginService.getBackendJwt(schAuthAccessToken)) {
        this.router.navigate(['tickets'])
      } else{

        //TODO
        console.log("unsuccessful login")
      }

      
     
    })
  }

  public pressLogin() {
    this.loginService.getSchAccessToken()
  }
}
