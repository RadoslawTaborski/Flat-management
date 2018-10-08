import { Component, OnInit } from '@angular/core';
import { Payment } from '../models/payment';
import { DbService } from '../db.service';
import { SharedService } from '../shared.service'
import { User } from '../models/user';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  providers: [ DbService ],
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  payments : Payment[] = [];
  newPayment : Payment = null;
  submitError: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    if(SharedService.users.length==0){
      this.getUsers();
    }
    this.getPayments();
    this.newPayment= new Payment(1,1,2,"mąka",2.5,0);

    this.addPayment(this.newPayment);
  }

  getUsers() {
    SharedService.users=[];
    this._dbService.getUsers()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        SharedService.users.push(new User(Number(elem.ID),elem.Login))
      });
      console.log(SharedService.users)
    })
  }

  getPayments() {
    this.payments=[];
    this._dbService.getPayments()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        this.payments.push(new Payment(Number(elem.ID),Number(elem.User1ID),Number(elem.User2ID),elem.Name,Number(elem.Amount),elem.IsReturn))
      });
      console.log(this.payments)
    })
  }

  addPayment(item: Payment) {
    this._dbService.addPayment(item)
      .subscribe(res => { this.getPayments(); }, err => { this.submitError = true; })
  };
}
