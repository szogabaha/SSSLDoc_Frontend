import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { LoginService } from '../../services/login/login.service'
import { UserTicketService } from '../../services/userTicketService/user-ticket.service'
import { Location } from '@angular/common';
import { CreateNewTicketRequest } from '../../model/CreateNewTicketRequest'

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor(private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private userTicketService: UserTicketService) { }

  ngOnInit(): void {
    this.loginService.checkJwtEstablished()

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

    this.userTicketService.getTicketByUuid("7e1b2d9a-c379-4871-aa6b-c038f3681a84").subscribe(ticket => {
      console.log(ticket)
    })
    ///Ezt kikommenteztem, hogy ne szemetelje szét a db-t, de egyébként itt egy példa új elem felvitelére.
    /*let request : CreateNewTicketRequest = {
      ticketType: "feedback-request",
      isAnonym: true,
      description: "negyedik requests"
    }
    this.userTicketService.createNewTickets(request).subscribe();
    */
  }
}
