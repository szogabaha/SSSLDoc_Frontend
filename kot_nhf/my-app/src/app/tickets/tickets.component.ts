import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { LoginService } from '../../services/login.service'
import { Location } from '@angular/common';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor(private loginService: LoginService, private activatedRoute: ActivatedRoute, private location : Location) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params =>{
      const schAuthAccessToken = params['code']
      if (schAuthAccessToken){
        console.log(schAuthAccessToken)
        this.loginService.getBackendJwt(schAuthAccessToken)
        this.location.replaceState(this.location.path().split('?')[0], '');
      }
      
    })  
  }

}
