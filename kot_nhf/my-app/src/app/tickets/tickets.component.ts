import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { LoginService } from '../../services/login/login.service'
import { UserTicketService } from '../../services/userTicketService/user-ticket.service'
import { Location } from '@angular/common';
import { CreateNewTicketRequest } from '../../model/CreateNewTicketRequest'
import { RegisteredByMe, RegisteredByMeRequest, Status } from 'src/model/RegisteredByMe';
import { Observable } from 'rxjs';
import { TicketDetail } from 'src/model/TicketDetail';
import { from } from 'rxjs';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor(private loginService: LoginService,
              private activatedRoute: ActivatedRoute, 
              private location : Location, 
              private userTicketService: UserTicketService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params =>{
      var schAuthAccessToken = params['code']
      if (schAuthAccessToken){
        console.log(schAuthAccessToken)
        this.loginService.getBackendJwt(schAuthAccessToken)
        this.location.replaceState(this.location.path().split('?')[0], '');


        this.userTicketService.getTicketByUuid("7e1b2d9a-c379-4871-aa6b-c038f3681a82").subscribe(ticket => {
          console.log(ticket);
        })
        this.filter = Status.All;
      }
      ///Ezt kikommenteztem, hogy ne szemetelje szét a db-t, de egyébként itt egy példa új elem felvitelére.
      /*let request : CreateNewTicketRequest = {
        ticketType: "misc",
        isAnonym: true,
        description: "valahanyadik"
      }
      this.userTicketService.createNewTickets(request).subscribe();*/
      this.getTickets();
      
    })  
  }

  getTickets() {
    this.userTicketService.getMyTickets().subscribe({
      next: data => {
        this.myregisteredtickets = data.registeredByMe.filter(cmp => {
          if (this.filter == Status.All){
            return true;
          }
          if (this.filter == Status.New){
            return cmp.assignedTo == null && cmp.isActive && cmp.ticketType != "feedback-request"
          }
          if (this.filter == Status.Assigned){
            return cmp.assignedTo != null && cmp.isActive && cmp.ticketType != "feedback-request"
          }
          if (this.filter == Status.Feedback){
            return cmp.ticketType == "feedback-request"
          }
          if (this.filter == Status.Closed){
            return !cmp.isActive && cmp.ticketType != "feedback-request"
          }
          return true;
        });
        this.assignedtickets = data.assignedToMe;
        console.log(this.myregisteredtickets);
        console.log(this.assignedtickets);
      },
      error: error => {
        console.log("ERROR");
      }            
    })
  }

  getType(ticket : RegisteredByMe) : string{
    let result = "";
    switch(ticket.ticketType){
      case "feedback-request":
        result = "Feedback";
        break;
      case "criticism":
        result = "Criticism";
        break;
      case "advice-request":
        result = "Advice";
        break;
      case "misc":
        result = "Misc";
        break;
    }
    return result;
  }

  getCreatedBy(ticket : RegisteredByMe) : string{
    if (ticket.createdBy == null){
      return "Anonymous";
    } else{
      return ticket.createdBy;
    }
  }

  getActive(ticket : RegisteredByMe) : string{
    if (ticket.isActive){
      return "Active";
    } else {
      return "Closed"
    }
  }

  getCreatedAt(ticket : RegisteredByMe) : string{
    let date = new Date(ticket.createdAt);
    return date.toLocaleString();
  }

  getAssignee(ticket: RegisteredByMe) : string{
    if (ticket.assignedTo == null){
      return "None";
    } else {
      return ticket.assignedTo;
    }
  }

  getStyle(ticket : RegisteredByMe) : string{
    if(ticket.ticketType == "feedback-request")
      return "table-warning";
    if(!ticket.isActive)
      return "table-dark";
    if(ticket.assignedTo == null)
      return "table-info";
    else
      return "table-secondary";
  }

  reFilter(filtering : Status){
      this.filter = filtering;
      this.getTickets();
  }

  myregisteredtickets : RegisteredByMe[] | undefined;
  //TODO: ha meglesz az ügyintézős / admin cucc, akkor kell majd vagy majd megkérdezem
  assignedtickets : RegisteredByMe[] | undefined;
  filter : Status = Status.All;
  public status = Status;
}
