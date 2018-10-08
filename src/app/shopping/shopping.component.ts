import { Component, OnInit } from '@angular/core';
import { DbService} from '../db.service';
import { ShoppingItem } from '../models/shoppingItem';
import { User } from '../models/user';
import { SharedService } from '../shared.service'

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  providers: [ DbService ],
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  shoppingItems : ShoppingItem[] =[];
  newShoppingItem : ShoppingItem = null;

  submitError: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    console.log(SharedService.length)
    if(SharedService.users.length==0){
      this.getUsers();
    }
    
    this.getShoppingItems();
  }

  getUsers() {
    this._dbService.getUsers()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        SharedService.users.push(new User(Number(elem.ID),elem.Login))
      });
      console.log(SharedService.users)
    })
  }

  getShoppingItems() {
    this._dbService.getShoppingItems()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        this.shoppingItems.push(new ShoppingItem(Number(elem.ID),Number(elem.Added),elem.Name,elem.Category,elem.IsBought))
      });
      console.log(this.shoppingItems)
    })
  }

  addShoppingItem(item: ShoppingItem) {
    this._dbService.addShoppingItem(item)
      .subscribe(res => { this.getShoppingItems(); }, err => { this.submitError = true; })
  };

  removeShoppingItem(item: ShoppingItem) {
    this._dbService.removeShoppingItem(item.Id)
      .subscribe(res => { this.getShoppingItems(); }, err => { this.submitError = true; })
  };
}
