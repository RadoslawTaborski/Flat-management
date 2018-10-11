import { Component, OnInit } from '@angular/core';
import { Payment, PaymentMapper } from '../models/payment';
import { DbService } from '../db.service';
import { SharedService } from '../shared.service'
import { User, DalUser, UserMapper } from '../models/user';
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
  userID: number = 1;
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  getUserByID(id: number): User{
    var a =SharedService.users.filter(x => x.ID == id)[0];
    return a;
  }

  getUsersItems(): User[]{
    return SharedService.users;
  }

  getUsersFilterItems(): string[]{
    return SharedService.usersFilters;
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  getData() {
    SharedService.users=[];
    this._dbService.getUsers()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        let tmp = UserMapper.ConvertToDalFromJson(elem);
        SharedService.users.push(UserMapper.ConvertToEntity(tmp))
      });
      console.log(SharedService.users)
      SharedService.usersFilters=[];
      SharedService.usersFilters.push("wszyscy");
      SharedService.users.forEach(item => {
        SharedService.usersFilters.push(item.Login)
      });
      this.loadedUsers=true;
      this.getPayments();
    })
  }

  getPayments() {
    this._dbService.getPayments()
    .subscribe((res: any[]) => {
      this.payments=[];
      this.filteredPayments=[];
      res.forEach(elem => {
        let tmp = PaymentMapper.ConvertToDalFromJson(elem);
        this.payments.push(PaymentMapper.ConvertToEntity(tmp, SharedService.users))
      });
      console.log(this.payments)
      this.filteredPayments=this.payments;
      this.selectedUser=[];
      this.selectedUser=this.selectedUser.concat(SharedService.users);

      this.loadedPayments=true;
    })
  }

  addPayment(item: Payment) {
    this._dbService.addPayment(PaymentMapper.ConvertToDal(item))
      .subscribe(res => { this.getPayments(); }, err => { this.submitError = true; })
  };

  addPayments(name: string, userID: number, value: number){
    if(this.selectedUser.length>0 && value>0 && name !=""){
    let nr: number = this.selectedUser.length;
    let val = Number((value/nr).toFixed(2));
    this._dbService.getLastActionNumber().subscribe(res => {
      //console.log(res[0]["MAX(Action)"]);
      let action = Number(res[0]["MAX(Action)"])+1;
      for(let u of this.selectedUser){
        if(u.ID!=this.getUserByID(this.userID).ID){
          let payment = new Payment(0,this.getUserByID(userID),u,name,val,0,action,"");
          this.addPayment(payment);
        }
      }
    });
  }
  }
}
