import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisteredByMe } from 'src/model/RegisteredByMe';
import { AddMessageRequest } from 'src/model/AddMessageRequest';
import { MessageFilter, TicketDetail, Message } from 'src/model/TicketDetail';
import { LoginService } from 'src/services/login/login.service';
import { UserTicketService } from '../../services/userTicket/user-ticket.service';
import { ModeratorServiceService } from 'src/services/moderator/moderator-service.service';
import { ErrorService } from 'src/services/error/error.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  //We have to play with it's value because we cannot identify it directly from the backend.
  isTicketOpen : boolean | undefined;
  constructor(private route: ActivatedRoute,
    private userTicketService: UserTicketService,
    private loginService: LoginService,
    private moderatorService: ModeratorServiceService,
    private errorService : ErrorService) { }

  ngOnInit(): void {
    this.loginService.checkJwtEstablished()
    this.route.params.subscribe(params => {
      this.ticketId = params['id'];
    });
    console.log(this.ticketId);
    this.getTicketDetails();
  }

  //This is quite an ugly solution but we couldn't solve it by any other way.
  //We try to get the ticket's state by querying the list of tickets and filtering them.
  //Just to mention it: When using getTicketByUuid, the response does not contain the status, that is why we've got to do this 
  getTicketDetails() {
    this.userTicketService.getTicketByUuid(this.ticketId).subscribe({
      next: dataOuter => {
        this.ticket = dataOuter;
        this.shownmessages = dataOuter.messages.filter(cmp => cmp.status = "Shown");
        this.unreviewedmessages = dataOuter.messages.filter(cmp => cmp.reviewedBy == "Unreviewed");
        this.discardedmessages = dataOuter.messages.filter(cmp => cmp.reviewedBy == "Discarded");
        this.userTicketService.getMyTickets().subscribe({
          next: data => {
            this.thisTicket = data.registeredByMe.find(cmp => cmp.ticketId == this.ticket?.ticketId || 0);
            if (this.thisTicket == null){
              this.moderatorService.getAllTickets().subscribe({
                next: dataInner => {
                  this.thisTicket = dataInner.tickets.find(cmp => cmp.ticketId == this.ticket?.ticketId || 0);
                  this.isTicketOpen = this.thisTicket?.isActive;
                }
              })
            } else{
              this.isTicketOpen = this.thisTicket.isActive;
            }
          }
        })
        
      },
      error: error => {
        console.log("ERROR");
        this.errorService.showError("ERROR");
      }
    })
  }

  //The following functions are binded to the elements of the DOM? so that they change dynamically when something else changes.
  getCreatedAt() {
    let date = new Date(this.ticket?.createdAt || Date());
    return date.toLocaleString();
  }
  getCreatedBy() {
    return this.ticket?.createdBy || "Anonymus"
  }
  getAssignee() {
    return this.ticket?.assignedTo || "None"
  }
  getType() {
    switch (this.ticket?.ticketType || "") {
      case "feedback-request":
        return "Feedback";
      case "criticism":
        return "Criticism";
      case "advice-request":
        return "Advice";
      case "misc":
        return "Misc";
      default:
        return "not identified"
    }
  }
  getMessageCreatedAt(message: Message) {
    let date = new Date(message.createdAt);
    return date.toLocaleString();
  }
  getMessageCreatedBy(message: Message) {
    if (message.createdBy == null) {
      return "Anonymous";
    } else {
      return message.createdBy;
    }
  }
  refilterMessages(filter: MessageFilter) {
    this.filter = filter;
  }
  //The value is set and binded in ngInit
  isOpen() {
    return this.isTicketOpen
  }

  //Delegating the requests to the service
  beginMessage() {
    this.newmessageimpending = true;
  }
  createMessage() {
    console.log(this.newdescription);
    let nm: AddMessageRequest = { message: this.newdescription };
    this.userTicketService.addMessageTo(this.ticket.ticketId, nm).subscribe();
    this.newmessageimpending = false;
    this.newdescription = "";
    this.getTicketDetails();
    window.location.reload();
  }
  abortMessage() {
    this.newmessageimpending = false;
    this.newdescription = "";
  }

  closeTicket() {
    if (this.isTicketOpen) {
      this.moderatorService.closeTicket(this.ticket.ticketId);
      window.location.reload();
    }
  }


  openTicket() {
    if (!this.isTicketOpen) {
      this.moderatorService.openTicket(this.ticket.ticketId);
      window.location.reload();
    }
  }

  alltickets!: RegisteredByMe[];
  shownmessages!: Message[];
  unreviewedmessages!: Message[];
  discardedmessages!: Message[];
  ticket!: TicketDetail;
  thisTicket : RegisteredByMe | undefined;
  filter: MessageFilter = MessageFilter.Shown;
  public messagesfilter = MessageFilter;
  ticketId!: string;
  newmessageimpending: boolean = false;
  newdescription: string = "";
  ticketInfoAddition!: RegisteredByMe;
  isituser : boolean = false;
  isitadmin : boolean = true;
}
