import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisteredByMe } from 'src/model/RegisteredByMe';
import { AddMessageRequest } from 'src/model/AddMessageRequest';
import { MessageFilter, TicketDetail, Message } from 'src/model/TicketDetail';
import { LoginService } from 'src/services/login/login.service';
import { UserTicketService } from '../../services/userTicketService/user-ticket.service';
import { ModeratorServiceService } from 'src/services/moderator/moderator-service.service';
import { windowTime } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  private isTicketOpen = false
  constructor(private route: ActivatedRoute,
    private userTicketService: UserTicketService,
    private loginService: LoginService,
    private moderatorService: ModeratorServiceService) { }

  ngOnInit(): void {
    this.loginService.checkJwtEstablished()
    this.route.params.subscribe(params => {
      this.ticketId = params['id'];
    });
    console.log(this.ticketId);
    this.getTicketDetails();
    this.userTicketService.getMyTickets().subscribe({
      next: data => {
        this.isTicketOpen = data.registeredByMe.find(cmp => cmp.ticketId == this.ticket?.ticketId || 0)?.isActive || false;
      }
    })
  }
  getTicketDetails() {
    this.userTicketService.getTicketByUuid(this.ticketId).subscribe({
      next: data => {
        this.ticket = data;
        this.shownmessages = this.ticket.messages.filter(cmp => cmp.status = "Shown");
        this.unreviewedmessages = this.ticket.messages.filter(cmp => cmp.reviewedBy == "Unreviewed");
        this.discardedmessages = this.ticket.messages.filter(cmp => cmp.reviewedBy == "Discarded");
        console.log(this.ticket);
      },
      error: error => {
        console.log("ERROR");
      }
    })
  }

  getCreatedAt() {
    return new Date(this.ticket?.createdAt || Date())
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
  isOpen() {
    return this.isTicketOpen
  }

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
  filter: MessageFilter = MessageFilter.Shown;
  public messagesfilter = MessageFilter;
  ticketId!: string;
  newmessageimpending: boolean = false;
  newdescription: string = "";
  ticketInfoAddition!: RegisteredByMe;
}
