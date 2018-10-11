import { Component, OnInit } from '@angular/core';
import { Payment } from '../models/payment';
import { DbService } from '../db.service';
import { SharedService } from '../shared.service'
import { User } from '../models/user';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  providers: [ DbService ],
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payments : Payment[] = [];
  filteredPayments: Payment[] = [];
  userId: number = 1;
  name: string;
  value: string;
  selectedUser: User[]=[];

  newPayment : Payment = null;

  submitError: boolean = false;
  loadedPayments: boolean = false;
  loadedUsers: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.loadedPayments=false;
    if(SharedService.users.length==0){
      this.getData();
    }else{
      this.getPayments();
    }
  }

  getData() {
    SharedService.users=[];
    this._dbService.getUsers()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        SharedService.users.push(new User(Number(elem.ID),elem.Login))
      });
      console.log(SharedService.users)
      SharedService.usersFilters=[];
      SharedService.usersFilters.push("wszyscy");
      SharedService.users.forEach(item => {
        SharedService.usersFilters.push(item.Login)
      });
      this.loadedUsers=true;
      this.getPayments();
      this.selectedUser=[];
      this.selectedUser=this.selectedUser.concat(SharedService.users);
    })
  }
  getUserById(id: number): User{
    var a =SharedService.users.filter(x => x.Id == id)[0];
    return a;
  }

  getUsersItems(): User[]{
    return SharedService.users;
  }

  getUsersFilterItems(): string[]{
    return SharedService.usersFilters;
  }

  getPayments() {
    this.payments=[];
    this.filteredPayments=[];
    this._dbService.getPayments()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        console.log(elem);
        this.payments.push(new Payment(Number(elem.ID),this.getUserById(Number(elem.User1ID)),this.getUserById(Number(elem.User2ID)),elem.Name,Number(elem.Amount),elem.IsReturn,Number(elem.Action),elem.Date))
      });
      console.log(this.payments)
      this.filteredPayments=this.payments;
      this.selectedUser=[];
      this.selectedUser=this.selectedUser.concat(SharedService.users);
      this.loadedPayments=true;
    })
  }

  addPayment(item: Payment) {
    this._dbService.addPayment(item)
      .subscribe(res => { this.getPayments(); }, err => { this.submitError = true; })
  };

  addPayments(name: string, userId: number, value: number){
    let nr: number = this.selectedUser.length;
    let val = value/nr;
    let action = Number(this._dbService.getLastActionNumber())+1;
    for(let u of this.selectedUser){
      if(u.Id!=this.getUserById(this.userId).Id){
        let payment = new Payment(0,this.getUserById(userId),u,name,value,0,action,"");
        this.addPayment(payment);
      }
    }
  }

  selectUser(user: User){
    const index: number = this.selectedUser.indexOf(user);
    if (index !== -1) {
      this.selectedUser.splice(index, 1); 
    } else {
      this.selectedUser.push(user);
    }
    console.log(this.selectedUser)
  }
}
