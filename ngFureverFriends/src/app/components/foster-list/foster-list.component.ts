import { Account } from './../../models/account';
import { ShelterService } from 'src/app/services/shelter.service';
import { FosterService } from './../../services/foster.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Foster } from './../../models/foster';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { EmailServiceImpl } from 'src/app/models/email';
import { NgForm } from '@angular/forms';
import { Shelter } from 'src/app/models/shelter';

@Component({
  selector: 'app-foster-list',
  templateUrl: './foster-list.component.html',
  styleUrls: ['./foster-list.component.css']
})
export class FosterListComponent implements OnInit {

  // FIELDS
  fosters: Foster[] = [];
  urlId: number;
  selected: Foster;
  sentEmailMessage: boolean;
  newEmail: EmailServiceImpl;
  account: Account;
  shelter: Shelter;

  // CONSTRUCTOR
  constructor(private svc: FosterService, private currentRoute: ActivatedRoute,
              private emailSvc: EmailService, private cdRef: ChangeDetectorRef,
              private shelterSvc: ShelterService) { }

  // METHODS
  ngOnInit() {
    this.loadEvents();

    this.account = JSON.parse(localStorage.getItem('account'));

    this.shelterSvc.index().subscribe(
      pass => {
        pass.forEach(e => {
          if (e.account.id === this.account.id) {
            this.shelter = e;
          }
        }
        );
      },
      fail => {}
    );
  }

  loadEvents() {
    this.svc.index().subscribe(
      (pass) => {
        this.fosters = pass;
      },
      (fail) => {
        console.error(fail);
      }
    );
  }

  openModule(foster: Foster) {
    this.selected = foster;
  }

  sendEmail(email: NgForm) {
    this.newEmail = email.value;
    this.newEmail.toAddress = 'fureverfriendsemail@gmail.com';
    email.value.email = this.shelter.email;
    // tslint:disable-next-line: max-line-length
    this.newEmail.body = 'Please send replies to the following email: <br/>' + email.value.email + '<br/><br/>----------------------<br/>Original Message:<br/>' + email.value.body;
    this.emailSvc.send(this.newEmail).subscribe(
      (pass) => {
        email.reset();
      },
      (fail) => {
        email.reset();
      }
    );
    // TRIGGERS UPDATE MESSAGE
    this.sentEmailMessage = false;
    this.cdRef.detectChanges();
    this.sentEmailMessage = true;
  }
}
