import { Component, OnInit } from '@angular/core';
import { Payment, PaymentMapper, PaymentGroup } from '../models/payment';
import { DbService } from '../db.service';
import { SharedService } from '../shared.service'
import { User, UserMapper } from '../models/user';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  providers: [DbService],
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  paymentsGroup: PaymentGroup[] = [];
  selected: [User, boolean][] = [];

  userID: number = 1;
  name: string;
  value: string;
  selectedUser: User[] = [];

  newPayment: Payment = null;

  submitError: boolean = false;
  loadedPayments: boolean = false;
  loadedUsers: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.loadedPayments = false;
    if (SharedService.users.length == 0) {
      this.getData();
    } else {
      this.getPayments();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  getUserByID(id: number): User {
    var a = SharedService.users.filter(x => x.ID == id)[0];
    return a;
  }

  getUsersItems(): User[] {
    return SharedService.users;
  }

  getUsersFilterItems(): string[] {
    return SharedService.usersFilters;
  }

  selectUser(user: User) {
    const index: number = this.findSelected(user);
    if (index !== -1) {
      this.selected[index]["1"] = !this.selected[index]["1"];
    }
    console.log(this.selected)
  }

  findSelected(user: User): number {
    let tmp = this.selected.filter(x => x["0"] == user)[0];
    console.log(tmp);
    return this.selected.indexOf(tmp);
  }

  groupPayments(payments: Payment[]) {
    this.paymentsGroup = [];
    this._dbService.getLastActionNumber().subscribe(res => {
      let action = Number(res[0]["MAX(Action)"]);
      for (let i = action; i >0; --i) {
        let tmpPayments = payments.filter(x => x.Action == i);
        if (tmpPayments.length > 0) {
          this.paymentsGroup.push(new PaymentGroup(tmpPayments));
        }
      }
      console.log(this.paymentsGroup);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  getData() {
    SharedService.users = [];
    this._dbService.getUsers()
      .subscribe((res: any[]) => {
        res.forEach(elem => {
          let tmp = UserMapper.ConvertToDalFromJson(elem);
          SharedService.users.push(UserMapper.ConvertToEntity(tmp))
        });
        console.log(SharedService.users)
        SharedService.usersFilters = [];
        SharedService.usersFilters.push("wszyscy");
        SharedService.users.forEach(item => {
          SharedService.usersFilters.push(item.Login)
        });
        this.selected = [];
        SharedService.users.forEach(item => {
          this.selected.push([item, true]);
        })
        this.loadedUsers = true;
        this.getPayments();
      })
  }

  getPayments() {
    this._dbService.getPayments()
      .subscribe((res: any[]) => {
        this.payments = [];
        this.filteredPayments = [];
        res.forEach(elem => {
          let tmp = PaymentMapper.ConvertToDalFromJson(elem);
          this.payments.push(PaymentMapper.ConvertToEntity(tmp, SharedService.users))
        });
        console.log(this.payments)
        this.filteredPayments = this.payments;

        this.groupPayments(this.filteredPayments);
        this.loadedPayments = true;
      })
  }

  addPayment(item: Payment) {
    this._dbService.addPayment(PaymentMapper.ConvertToDal(item))
      .subscribe(res => { this.getPayments(); }, err => { this.submitError = true; })
  };

  countSelectedUsers(): number {
    let result = 0;
    this.selected.forEach(item => {
      if (item["1"]) {
        result++;
      }
    });
    return result;
  }

  getSelectedUsers(): User[] {
    let result: User[] = [];
    this.selected.forEach(item => {
      if (item["1"]) {
        result.push(item["0"])
      }
    });
    return result;
  }

  addPayments(name: string, userID: number, value: number) {
    let count = this.countSelectedUsers();
    if (count > 0 && value > 0 && name != "") {
      let nr: number = count;
      let val = Number((value / nr).toFixed(2));
      this._dbService.getLastActionNumber().subscribe(res => {
        //console.log(res[0]["MAX(Action)"]);
        let action = Number(res[0]["MAX(Action)"]) + 1;
        for (let u of this.getSelectedUsers()) {
          let payment = new Payment(0, this.getUserByID(userID), u, name, val, 0, action, "");
          this.addPayment(payment);
        }
      });
    }
  }
}
