import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisteredByMe } from 'src/model/RegisteredByMe';
import { AddMessageRequest } from 'src/model/AddMessageRequest';
import { MessageFilter, TicketDetail, Message } from 'src/model/TicketDetail';
import { LoginService } from 'src/services/login/login.service';
import { UserTicketService } from '../../services/userTicketService/user-ticket.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    private userTicketService: UserTicketService, 
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.checkJwtEstablished()
    this.route.params.subscribe(params => {
      this.ticketId = params['id'];
    });
    console.log(this.ticketId);
    this.getTicketDetails();
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

  getCreatedAt(){
    let date = new Date(this.ticket.createdAt);
    return date.toLocaleString();
  }
  getCreatedBy(){
    if (this.ticket.createdBy == null) {
      return "Anonymous";
    } else {
      return this.ticket.createdBy;
    }
  }
  getAssignee()
  {
    if (this.ticket.assignedTo == null) {
      return "None";
    } else {
      return this.ticket.assignedTo;
    }
  }
  getType()
  {
    let result = "";
    switch (this.ticket.ticketType) {
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
  getMessageCreatedAt(message : Message){
    let date = new Date(message.createdAt);
    return date.toLocaleString();
  }
  getMessageCreatedBy(message : Message){
    if (message.createdBy == null) {
      return "Anonymous";
    } else {
      return message.createdBy;
    }
  }
  refilterMessages(filter : MessageFilter){
    this.filter = filter;
  }
  isOpen(){
    this.userTicketService.getMyTickets().subscribe({
      next: data => {
        this.alltickets = data.registeredByMe;
      }
    })
    let ticketInfoAddition = this.alltickets.find(cmp => cmp.ticketId == this.ticket.ticketId);
    return ticketInfoAddition?.isActive;
  }
  beginMessage(){
    this.newmessageimpending = true;
  }
  createMessage(){
    console.log(this.newdescription);
    this.newmessage.message = this.newdescription;
    this.userTicketService.addMessageTo(this.ticket.ticketId, this.newmessage).subscribe();
    this.newmessageimpending = false;
    this.newdescription = "";
    this.getTicketDetails();
  }
  abortMessage(){
    this.newmessageimpending = false;
    this.newdescription = "";
  }

  alltickets! : RegisteredByMe[];
  shownmessages! : Message[];
  unreviewedmessages! : Message[];
  discardedmessages! : Message[];
  ticket!: TicketDetail;
  filter : MessageFilter = MessageFilter.Shown;
  public messagesfilter = MessageFilter;
  ticketId!: string;
  newmessageimpending : boolean = false;
  newdescription : string = "";
  newmessage! : AddMessageRequest;
}
