import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TicketsComponent } from './tickets/tickets.component';

import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

import { HttpClientModule } from '@angular/common/http';
import { TicketNewComponent } from './ticket-new/ticket-new.component';

@NgModule({
  declarations: [
    AppComponent,
    TicketsComponent,
    LoginComponent,
    TicketDetailComponent,
    TicketNewComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'tickets', component: TicketsComponent},
      {path: 'login', component: LoginComponent},
      {path: 'tickets/new', component: TicketNewComponent},
      {path: 'tickets/:id', component: TicketDetailComponent},
      {path: '', redirectTo: '/login', pathMatch: 'full'}

    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
