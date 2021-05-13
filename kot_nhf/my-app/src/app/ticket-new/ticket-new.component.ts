import { Component, OnInit } from '@angular/core';
import { CreateNewTicketRequest } from 'src/model/CreateNewTicketRequest';
import { UserTicketService } from '../../services/userTicketService/user-ticket.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['./ticket-new.component.css']
})
export class TicketNewComponent implements OnInit {

  constructor(private userTicketService: UserTicketService,
    private router : Router ) {}

  ngOnInit(): void {
    this.type = "Feedback";
    this.description = "";
    this.anonym = false;
  }

  createTicket(){
    let type = "";
    switch (this.type) {
      case "Feedback":
        type = "feedback-request";
        break;
      case "Advice":
        type = "advice-request";
        break;
      case "Misc":
        type = "misc";
        break;
      case "Criticism":
        type = "criticism";
        break;
      default:
        break;
    }
    let ticket : CreateNewTicketRequest = {
      ticketType : type,
      isAnonym : this.anonym,
      description : this.description
    }
    this.userTicketService.createNewTickets(ticket).subscribe();
    this.router.navigate(["/tickets"]);
  }

  type! : string;
  description! : string;
  anonym! : boolean;
}
