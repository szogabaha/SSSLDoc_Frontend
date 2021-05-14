import { Component } from '@angular/core';
import { LoginService } from '../services/login/login.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  constructor(private loginService : LoginService) { }

  pressLogout() {
    this.loginService.logout()
  }

  //This is a delegate function that we can use to bind a boolean value to a dom element.
  isAuthenticated(){
    return Boolean(this.loginService.getJwt())
  }
}
