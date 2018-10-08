import { Component, OnInit } from '@angular/core';
import { Balance } from '../models/balance';
import { DbService } from '../db.service';
import { SharedService } from '../shared.service'
import { User } from '../models/user';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  providers: [ DbService ],
  styleUrls: ['./balances.component.css']
})
export class BalancesComponent implements OnInit {
  balances : Balance[] = [];
  submitError: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    if(SharedService.users.length=0){
      this.getUsers();
    }
    
    this.getBalances();
  }

  getUsers() {
    this._dbService.getUsers()
    .subscribe((res: User[]) => {
      console.log(res);
      SharedService.users = res;
    })
  }
  
  getBalances() {
    this._dbService.getPayments()
    .subscribe((res: Balance[]) => {
      console.log(res);
      this.balances = res;
    })
  }

}
