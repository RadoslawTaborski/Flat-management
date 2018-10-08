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
  newShoppingItem : ShoppingItem = new ShoppingItem();

  submitError: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    if(SharedService.users.length=0){
      this.getUsers();
    }
    
    this.getShoppingItems();

    this.newShoppingItem.Id=3;
    this.newShoppingItem.Category="szamka";
    this.newShoppingItem.Name="kasza";
    this.newShoppingItem.UserId=1;

    this.addShoppingItem(this.newShoppingItem);

    this.removeShoppingItem(this.newShoppingItem);
  }

  getUsers() {
    this._dbService.getUsers()
    .subscribe((res: User[]) => {
      console.log(res);
      SharedService.users = res;
    })
  }

  getShoppingItems() {
    this._dbService.getShoppingItems()
    .subscribe((res: ShoppingItem[]) => {
      console.log(res);
      this.shoppingItems = res;
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
