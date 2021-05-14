import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { UserTicketService } from '../../services/userTicket/user-ticket.service';
import { RegisteredByMe, Status } from 'src/model/RegisteredByMe';
import { ModeratorServiceService } from '../../services/moderator/moderator-service.service'
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/services/error/error.service'

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor(private loginService: LoginService,
    private userTicketService: UserTicketService,
    private moderatorService: ModeratorServiceService,
    private errorService : ErrorService) { }

  ngOnInit(): void {
    this.loginService.checkJwtEstablished();
    this.getTickets();
  }

  getTickets() {
    if (this.showbuttonstate){
      if (this.subscription != undefined)
        this.subscription.unsubscribe();
      this.subscription = this.userTicketService.getMyTickets().subscribe({
        next: data => {
          this.myregisteredtickets = data.registeredByMe.filter(cmp => {
            if (this.filter == Status.All) {
              return true;
            }
            if (this.filter == Status.New) {
              return cmp.assignedTo == null && cmp.isActive && cmp.ticketType != "feedback-request"
            }
            if (this.filter == Status.Assigned) {
              return cmp.assignedTo != null && cmp.isActive && cmp.ticketType != "feedback-request"
            }
            if (this.filter == Status.Feedback) {
              return cmp.ticketType == "feedback-request" && cmp.isActive
            }
            if (this.filter == Status.Closed) {
              return !cmp.isActive
            }
            return true;
          });
        },
        error: error => {
          this.errorService.showError("ERROR");
        }
      })
    } else {
      if (this.subscription != undefined)
        this.subscription.unsubscribe();
      this.subscription = this.moderatorService.getAllTickets().subscribe({
        next: data => {
          this.myregisteredtickets = data.tickets.filter(cmp => {
            if (this.filter == Status.All) {
              return true;
            }
            if (this.filter == Status.New) {
              return cmp.assignedTo == null && cmp.isActive && cmp.ticketType != "feedback-request"
            }
            if (this.filter == Status.Assigned) {
              return cmp.assignedTo != null && cmp.isActive && cmp.ticketType != "feedback-request"
            }
            if (this.filter == Status.Feedback) {
              return cmp.ticketType == "feedback-request" && cmp.isActive
            }
            if (this.filter == Status.Closed) {
              return !cmp.isActive
            }
            return true;
          });

        },
        error: error => {
          this.errorService.showError("ERROR");
        }
      })
    }
    
  }

  getType(ticket: RegisteredByMe): string {
    let result = "";
    switch (ticket.ticketType) {
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

  getCreatedBy(ticket: RegisteredByMe): string {
    if (ticket.createdBy == null) {
      return "Anonymous";
    } else {
      return ticket.createdBy;
    }
  }

  getActive(ticket: RegisteredByMe): string {
    if (ticket.isActive) {
      return "Active";
    } else {
      return "Closed"
    }
  }

  getCreatedAt(ticket: RegisteredByMe): string {
    let date = new Date(ticket.createdAt);
    return date.toLocaleString();
  }

  getAssignee(ticket: RegisteredByMe): string {
    if (ticket.assignedTo == null) {
      return "None";
    } else {
      return ticket.assignedTo;
    }
  }

  getStyle(ticket: RegisteredByMe): string {
    if (!ticket.isActive)
      return "table-dark";
    if (ticket.assignedTo == null)
      return "table-info";
    else
      return "table-secondary";
  }

  reFilter(filtering: Status) {
    this.filter = filtering;
    this.getTickets();
  }

  switchAdminButton() {
    if (this.showbuttonstate) {
      this.showbuttonstate = false;
    } else {
      this.showbuttonstate = true;
    }
    console.log(this.showbuttonstate);
    if (this.showbuttonstate) {
      this.showbuttontext = "Show all tickets";
    } else {
      this.showbuttontext = "Show my tickets";
    }
    this.getTickets();
  }
  myregisteredtickets: RegisteredByMe[] | undefined;
  //TODO: ha meglesz az ügyintézős / admin cucc, akkor kell majd vagy majd megkérdezem
  assignedtickets: RegisteredByMe[] | undefined;
  filter: Status = Status.All;
  public status = Status;
  isituser : boolean = false;
  showbuttontext : string = "Show my tickets";
  showbuttonstate : boolean = false;
  subscription! : Subscription;
}
