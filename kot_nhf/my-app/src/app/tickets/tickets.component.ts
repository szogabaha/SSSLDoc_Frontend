import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { LoginService } from '../../services/login/login.service'
import { UserTicketService } from '../../services/listMyTickets/user-ticket.service'
import { Location } from '@angular/common';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor(private loginService: LoginService, private activatedRoute: ActivatedRoute, private location : Location, private userTicketService: UserTicketService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params =>{
      var schAuthAccessToken = params['code']
      if (schAuthAccessToken){
        console.log(schAuthAccessToken)
        this.loginService.getBackendJwt(schAuthAccessToken)
        this.location.replaceState(this.location.path().split('?')[0], '');

        //TODO ez csak egy példa arra, hogy hogyan kell használni a service-t.
        let myTickets = this.userTicketService.getMyTickets().subscribe({
          next: data => {
            let list = data.registeredByMe
            console.log(list)
            return list
          },
          error: error => {
            console.log("ERROR")
          }            
        })

      }
      
    })  
  }

}
