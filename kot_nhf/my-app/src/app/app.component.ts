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

  isAuthenticated(){
    return Boolean(this.loginService.getJwt())
  }
}
