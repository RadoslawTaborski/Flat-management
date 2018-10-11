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
    if(SharedService.users.length==0){
      this.getData();
    }else{    
      this.getShoppingItems();
    }
  }

  getData() {
    SharedService.users=[];
    this._dbService.getUsers()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        SharedService.users.push(new User(Number(elem.ID),elem.Login))
      });
      SharedService.usersFilters=[];
      console.log(SharedService.users)
      SharedService.usersFilters.push("wszyscy");
      SharedService.users.forEach(item => {
        SharedService.usersFilters.push(item.Login)
      });
      this.loadedUsers=true;
      this.getShoppingItems();
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

  getShoppingItems() {
    this.shoppingItems=[];
    this.filteredShoppingItems=[];
    this._dbService.getShoppingItems()
    .subscribe((res: any[]) => {
      res.forEach(elem => {
        this.shoppingItems.push(new ShoppingItem(Number(elem.ID),this.getUserById(Number(elem.Added)),elem.Name,elem.Category,elem.IsBought, elem.AddDate, elem.BoughtDate))
      });
      console.log(this.shoppingItems)
      this.filteredShoppingItems=this.shoppingItems;
      this.loadedShopping=true;
    })
  }

  createShoppingItem(user: number, name: string, category: number): ShoppingItem{
    console.log(user,name,category)
    return new ShoppingItem(0,this.getUserById(user), name ,this.categories[category],0,"","");
  }

  addShoppingItem(item: ShoppingItem) {
    if(item.Name!="" && item.User!=null && item.Category!=""){
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
      this.filteredShoppingItems=this.shoppingItems.filter(x => x.Category == this.categoriesFilter[category] && SharedService.usersFilters[user] == x.User.Login)
    }else if(user != 0){
      this.filteredShoppingItems=this.shoppingItems.filter(x => SharedService.usersFilters[user] == x.User.Login)
    }else if(category != 0){
      this.filteredShoppingItems=this.shoppingItems.filter(x => x.Category == this.categoriesFilter[category])
    }
  }
}
