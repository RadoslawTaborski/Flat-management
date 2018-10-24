import { Component, OnInit } from '@angular/core';
import { Payment, PaymentMapper, PaymentGroup } from '../models/payment';
import { DbService } from '../db.service';
import { SharedService } from '../shared.service'
import { User, UserMapper } from '../models/user';
import { forEach } from '@angular/router/src/utils/collection';
import { formatDate } from '@angular/common';
import { PaymentType } from '../models/payment.type';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  value: string = "";
  selectedUser: User[] = [];

  newPayment: Payment = null;

  submitError: boolean = false;
  loadedPayments: boolean = false;
  loadedUsers: boolean = false;
  add: boolean = false;
  det: boolean[] = [];

  deviceInfo= null;
  isMobile = false;
  isDesktop = false;
  isTablet = false;
  filteredPaymentsGr: PaymentGroup[] = [];
  user1Filter: number = 0;
  user2Filter: number = 0;

  constructor(private _dbService: DbService, private deviceService: DeviceDetectorService) {}

  public detectDevice(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile=this.deviceService.isMobile();
    this.isDesktop=this.deviceService.isDesktop();
    this.isTablet=this.deviceService.isTablet();
  }
  async ngOnInit() {
    this.detectDevice();
    this.loadedPayments = false;
    if (SharedService.users.length == 0) {
      await this.getData();
    }
    this.setCheckbox();
    await this.getPayments();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  setAdd(){
    this.add=!this.add;
  }

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
    //console.log(this.selected)
  }

  findSelected(user: User): number {
    //console.log(user)
    let tmp = this.selected.filter(x => x["0"] == user)[0];
    //console.log(tmp);
    return this.selected.indexOf(tmp);
  }

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

  checkDate(group: PaymentGroup): boolean {
    let current = formatDate(new Date().setMinutes(new Date().getMinutes()-15), 'yyyy-MM-dd HH:mm:ss', 'en');
    return group.AddDate > current;
  }

  getDetails(nr:number){
    this.det[nr]=!this.det[nr];
  }

  setCheckbox(){
    SharedService.users.forEach(item => {
      this.selected.push([item, true]);
    })
  }

  filtering(user1: number, user2: number) {
    //console.log(user1, user2)
    if (user1 == 0 && user2 == 0) {
      this.filteredPaymentsGr = this.paymentsGroup;
    } else if (user1 != 0 && user2 != 0) {
      this.filteredPaymentsGr = this.paymentsGroup.filter(x => x.User1.Login == SharedService.usersFilters[user1] && this.isPaymentsConcernUser(SharedService.usersFilters[user2],x))
    } else if (user1 != 0) {
      this.filteredPaymentsGr = this.paymentsGroup.filter(x => x.User1.Login == SharedService.usersFilters[user1])
    } else if (user2 != 0) {
      this.filteredPaymentsGr = this.paymentsGroup.filter(x => this.isPaymentsConcernUser(SharedService.usersFilters[user2],x))
      //console.log(this.filteredPaymentsGr)
    }
  }
  
  isPaymentsConcernUser(login: string, group: PaymentGroup): boolean{
    let result = false;
    group.Payments.forEach(element =>{
      if(element.User2.Login == login){
        //console.log(login)
        result=true;
      }
    })
    //console.log(result)
    return result;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  async groupPayments(payments: Payment[]) {
    this.det=[];
    this.paymentsGroup = [];
    let res = await this._dbService.getLastActionNumber();
    let action = Number(res[0]["MAX(Action)"]);
    for (let i = action; i > 0; --i) {
      let tmpPayments = payments.filter(x => x.Action == i);
      if (tmpPayments.length > 0) {
        this.paymentsGroup.push(new PaymentGroup(tmpPayments));
        this.det.push(false);
      }
    }
    this.filteredPaymentsGr=this.paymentsGroup;
    //console.log(this.filteredPaymentsGr);
  }

  async getData() {
    SharedService.users = [];
    this.selected = [];
    let res = await this._dbService.getUsers()
    res.forEach(elem => {
      let tmp = UserMapper.ConvertToDalFromJson(elem);
      SharedService.users.push(UserMapper.ConvertToEntity(tmp))
    });
    //console.log(SharedService.users)
    SharedService.usersFilters = [];
    SharedService.usersFilters.push("wszyscy");
    SharedService.users.forEach(item => {
      SharedService.usersFilters.push(item.Login)
    });
    this.loadedUsers = true;
  }

  async getPayments() {
    let res = await this._dbService.getPayments()
    this.payments = [];
    this.filteredPayments = [];
    res.forEach(elem => {
      let tmp = PaymentMapper.ConvertToDalFromJson(elem);
      this.payments.push(PaymentMapper.ConvertToEntity(tmp, SharedService.users))
    });
    //console.log(this.payments)
    this.filteredPayments = this.payments;

    this.groupPayments(this.filteredPayments);
    this.loadedPayments = true;
    this.add=false;
  }

  async addPayment(item: Payment) {
    await this._dbService.addPayment(PaymentMapper.ConvertToDal(item))
  };

  async rollback(item: PaymentGroup) {
    //console.log(item, item.Action)
    item.Payments.forEach(async element => {
      await this._dbService.rollback(element.ID);
    });
    this.getPayments();
  };

  async addPayments(name: string, userID: number, value: string) {
    //console.log(value)
    let amount = SharedService.str2Int(value);
    let count = this.countSelectedUsers();
    if (count > 0 && amount > 0 && !SharedService.isNullOrWhiteSpace(name)) {
      let nr: number = count;
      let val = Number((amount / nr).toFixed(2));
      let res = await this._dbService.getLastActionNumber();
      //console.log(res[0]["MAX(Action)"]);
      let action = Number(res[0]["MAX(Action)"]) + 1;
      for (let u of this.getSelectedUsers()) {
        let payment = new Payment(0, this.getUserByID(userID), u, name, val, PaymentType.expense, action, "");
        await this.addPayment(payment);
      }
      this.getPayments();
      this.value = "";
      this.name = "";
      this.add = false;
    }
  }
}
