import { Component, OnInit } from '@angular/core';
import { Balance, DalBalance, BalanceMapper } from '../models/balance';
import { DbService } from '../db.service';
import { SharedService } from '../shared.service'
import { User, DalUser, UserMapper } from '../models/user';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  providers: [ DbService ],
  styleUrls: ['./balances.component.css']
})
export class BalancesComponent implements OnInit {
  balances : Balance[] = [];
  filteredBalances: Balance[] = [];
  usersFilter: string[] = [];
  user1Filter: number = 0;
  user2Filter: number = 0;

  submitError: boolean = false;
  loadedBalances: boolean = false;
  loadedUsers: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.loadedBalances=false;
    if(SharedService.users.length==0){
      this.getData();
    }{
      this.getBalances();
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

  filtering(user1: number, user2: number) {
    console.log(user1,user2)
    if(user1 == 0 && user2 == 0){
      this.filteredBalances=this.balances;
    }else if(user1 != 0 && user2 != 0) {
      this.filteredBalances=this.balances.filter(x => x.User1.Login == SharedService.usersFilters[user1] && SharedService.usersFilters[user2] == x.User2.Login)
    }else if(user1 != 0){
      this.filteredBalances=this.balances.filter(x => x.User1.Login == SharedService.usersFilters[user1])
    }else if(user2 != 0){
      this.filteredBalances=this.balances.filter(x => SharedService.usersFilters[user2] == x.User2.Login)
    }
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
      this.getBalances();
    })
  }

  getBalances() {
    this.filteredBalances=[];
    this._dbService.getBalances()
    .subscribe((res: any[]) => {
      this.balances=[];
      res.forEach(elem => {
        let tmp = BalanceMapper.ConvertToDalFromJson(elem);
        this.balances.push(BalanceMapper.ConvertToEntity(tmp, SharedService.users))
      });
      console.log(this.balances)
      this.filteredBalances=this.balances;
      this.loadedBalances=true;
    })
  }
}
