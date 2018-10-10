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
  categories: string[] = ["chemia", "spożywcze", "inne"];
  categoriesFilter: string[] = ["wszystkie","chemia", "spożywcze", "inne"];
  usersFilter: string[] = [];
  userId: number=1;
  categoryId: number=0;
  name: string;
  userFilter: number = 0;
  categoryFilter: number = 0;

  shoppingItems : ShoppingItem[] =[];
  filteredShoppingItems : ShoppingItem[] =[];
  newShoppingItem : ShoppingItem = null;

  submitError: boolean = false;
  loadedShopping: boolean = false;
  loadedUsers: boolean = false;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.loadedShopping=false;
    this.loadedUsers=false;
    if(SharedService.users.length==0){
      this.getUsers();
    }
    
    this.getShoppingItems();
  }

  getUsers() {
    SharedService.users=[];
    this._dbService.getUsers()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        SharedService.users.push(new User(Number(elem.ID),elem.Login))
      });
      console.log(SharedService.users)
      this.usersFilter.push("wszyscy");
      SharedService.users.forEach(item => {
        this.usersFilter.push(item.Login)
      });
      this.loadedUsers=true;
    })
  }

  getUserById(id: number): User{
    var a =SharedService.users.filter(x => x.Id == id)[0];
    return a;
  }

  getUsersItems(): User[]{
    return SharedService.users;
  }

  getShoppingItems() {
    this.shoppingItems=[];
    this._dbService.getShoppingItems()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        this.shoppingItems.push(new ShoppingItem(Number(elem.ID),Number(elem.Added),elem.Name,elem.Category,elem.IsBought))
      });
      console.log(this.shoppingItems)
      this.filteredShoppingItems=this.shoppingItems;
      this.loadedShopping=true;
    })
  }

  createShoppingItem(user: number, name: string, category: number): ShoppingItem{
    console.log(user,name,category)
    return new ShoppingItem(0,user, name ,this.categories[category],0);
  }

  addShoppingItem(item: ShoppingItem) {
    if(item.Name!="" && item.UserId!=0 && item.Category!=""){
    this._dbService.addShoppingItem(item)
      .subscribe(res => { this.getShoppingItems(); }, err => { this.submitError = true; })
    }
  }

  removeShoppingItem(item: ShoppingItem) {
    this._dbService.removeShoppingItem(item.Id)
      .subscribe(res => { this.getShoppingItems(); }, err => { this.submitError = true; })
  }

  filtering(user: number, category: number) {
    console.log(user,name,category)
    if(user == 0 && category == 0){
      this.filteredShoppingItems=this.shoppingItems;
    }else if(user != 0 && category != 0) {
      this.filteredShoppingItems=this.shoppingItems.filter(x => x.Category == this.categoriesFilter[category] && this.usersFilter[user] == this.getUserById(x.UserId).Login)
    }else if(user != 0){
      this.filteredShoppingItems=this.shoppingItems.filter(x => this.usersFilter[user] == this.getUserById(x.UserId).Login)
    }else if(category != 0){
      this.filteredShoppingItems=this.shoppingItems.filter(x => x.Category == this.categoriesFilter[category])
    }
  }
}
