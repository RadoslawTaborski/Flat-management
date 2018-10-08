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
  newPayment : Payment = new Payment();
  submitError: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    if(SharedService.users.length=0){
      this.getUsers();
    }

    this.getPayments();

    this.newPayment.User1Id=1;
    this.newPayment.User2Id=2;
    this.newPayment.Name="whiskey";
    this.newPayment.IsReturn=0;
    this.newPayment.Value=4.5;

    this.addPayment(this.newPayment);
  }
  getUsers() {
    this._dbService.getUsers()
    .subscribe((res: User[]) => {
      console.log(res);
      SharedService.users = res;
    })
  }

  getPayments() {
    this._dbService.getPayments()
    .subscribe((res: Payment[]) => {
      console.log(res);
      this.payments = res;
    })
  }

  addPayment(item: Payment) {
    this._dbService.addPayment(item)
      .subscribe(res => { this.getPayments(); }, err => { this.submitError = true; })
  };
}
