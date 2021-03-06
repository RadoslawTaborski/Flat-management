import { Component, OnInit } from '@angular/core';
import { Balance, DalBalance, BalanceMapper } from '../models/balance';
import { DbService } from '../db.service';
import { SharedService } from '../shared.service'
import { User, DalUser, UserMapper } from '../models/user';
import { Payment, PaymentMapper } from '../models/payment';
import { PaymentType } from '../models/payment.type';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  providers: [DbService],
  styleUrls: ['./balances.component.css']
})
export class BalancesComponent implements OnInit {
  balances: Balance[] = [];
  filteredBalances: Balance[] = [];
  usersFilter: string[] = [];
  user1Filter: number = 0;
  user2Filter: number = 0;
  value: string[] = []

  submitError: boolean = false;
  loadedBalances: boolean = false;
  loadedUsers: boolean = false;
  ret: boolean[] = [];

  deviceInfo= null;
  isMobile = false;
  isDesktop = false;
  isTablet = false;

  constructor(private _dbService: DbService, private deviceService: DeviceDetectorService) {}

  public detectDevice(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile=this.deviceService.isMobile();
    this.isDesktop=this.deviceService.isDesktop();
    this.isTablet=this.deviceService.isTablet();
  }

  async ngOnInit() {
    this.detectDevice();
    this.loadedBalances = false;
    this.user1Filter = 0;
    this.user2Filter = 0;
    if (SharedService.users.length == 0) {
      await this.getData();
    }
    await this.getBalances();
    this.filtering(this.user1Filter,this.user2Filter);
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

  filtering(user1: number, user2: number) {
    //console.log(user1, user2)
    if (user1 == 0 && user2 == 0) {
      this.filteredBalances = this.balances;
    } else if (user1 != 0 && user2 != 0) {
      this.filteredBalances = this.balances.filter(x => x.User1.Login == SharedService.usersFilters[user1] && SharedService.usersFilters[user2] == x.User2.Login)
    } else if (user1 != 0) {
      this.filteredBalances = this.balances.filter(x => x.User1.Login == SharedService.usersFilters[user1])
    } else if (user2 != 0) {
      this.filteredBalances = this.balances.filter(x => SharedService.usersFilters[user2] == x.User2.Login)
    }
  }

  setReturn(nr: number){
    this.ret[nr]=!this.ret[nr];
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  async getData() {
    SharedService.users = [];
    let res = await this._dbService.getUsers();
    res.forEach(elem => {
      let tmp = UserMapper.ConvertToDalFromJson(elem);
      SharedService.users.push(UserMapper.ConvertToEntity(tmp))
    });
    //(SharedService.users)
    SharedService.usersFilters = [];
    SharedService.usersFilters.push("wszyscy");
    SharedService.users.forEach(item => {
      SharedService.usersFilters.push(item.Login)
    });
    this.loadedUsers = true;
  }

  async getBalances() {
    this.balances = [];
    this.filteredBalances = [];
    let res = await this._dbService.getBalances();
    res.forEach(elem => {
      let tmp = BalanceMapper.ConvertToDalFromJson(elem);
      this.balances.push(BalanceMapper.ConvertToEntity(tmp, SharedService.users))
    });
    for (let i = 0; i < this.balances.length; ++i) {
      this.value.push("");
      this.ret.push(false);
    }
    //console.log(this.balances)
    this.filteredBalances = this.balances;
    this.loadedBalances = true;
  }

  async addPayment(user1: User, user2: User, value: string) {
    let val = SharedService.str2Int(value);
    if (val > 0) {
      let res = await this._dbService.getLastActionNumber();
      //console.log(res[0]["MAX(Action)"]);
      let action = Number(res[0]["MAX(Action)"]) + 1;
      let tmp = new Payment(0, user1, user2, "ZWROT", val, PaymentType["return-cash"], action, "");

      await this._dbService.addPayment(PaymentMapper.ConvertToDal(tmp));
      await this.getBalances();
      this.filtering(this.user1Filter,this.user2Filter);

      for (let i = 0; i < this.value.length; ++i) {
        this.value[i] = "";
        this.ret[i] = false;
      }
    }
  };
}
