import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { ShoppingItem, ShoppingItemMapper } from '../models/shoppingItem';
import { User, UserMapper } from '../models/user';
import { SharedService } from '../shared.service';
import {DeviceDetectorModule, DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  providers: [DbService],
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  categories: string[] = ["chemia", "spożywcze", "inne"];
  categoriesFilter: string[] = ["wszystkie", "chemia", "spożywcze", "inne"];
  userID: number = 1;
  categoryID: number = 0;
  name: string;
  userFilter: number = 0;
  categoryFilter: number = 0;

  shoppingItems: ShoppingItem[] = [];
  filteredShoppingItems: ShoppingItem[] = [];
  newShoppingItem: ShoppingItem = null;

  submitError: boolean = false;
  loadedShopping: boolean = false;
  loadedUsers: boolean = false;

  deviceInfo= null;
  isMobile = false;
  isDesktop = false;

  constructor(private _dbService: DbService, private deviceService: DeviceDetectorService) {}

  public detectDevice(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile=this.deviceService.isMobile();
    this.isDesktop=this.deviceService.isDesktop();
  }
  
  async ngOnInit() {
    this.detectDevice();
    this.loadedShopping = false;
    this.userID = 1;
    this.categoryID = 0;
    if (SharedService.users.length == 0) {
      await this.getData();
    }
    await this.getShoppingItems();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  getUserByID(id: number): User {
    //console.log(id)
    var a = SharedService.users.filter(x => x.ID == id)[0];
    //console.log(SharedService.users)
    return a;
  }

  getUsersItems(): User[] {
    return SharedService.users;
  }

  getUsersFilterItems(): string[] {
    //console.log(SharedService.usersFilters)
    return SharedService.usersFilters;
  }

  createShoppingItem(user: number, name: string, category: number): ShoppingItem {
    //console.log(user,name,category)
    return new ShoppingItem(0, this.getUserByID(user), name, this.categories[category], 0, "", "");
  }

  filtering(user: number, category: number) {
    if (user == 0 && category == 0) {
      this.filteredShoppingItems = this.shoppingItems;
    } else if (user != 0 && category != 0) {
      this.filteredShoppingItems = this.shoppingItems.filter(x => x.Category == this.categoriesFilter[category] && SharedService.usersFilters[user] == x.User.Login)
    } else if (user != 0) {
      this.filteredShoppingItems = this.shoppingItems.filter(x => SharedService.usersFilters[user] == x.User.Login)
    } else if (category != 0) {
      this.filteredShoppingItems = this.shoppingItems.filter(x => x.Category == this.categoriesFilter[category])
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  async getData() {
    SharedService.users = [];
    let res = await this._dbService.getUsers()
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
    this.loadedUsers = true;
  }

  async getShoppingItems() {
    this.shoppingItems = [];
    this.filteredShoppingItems = [];
    let res = await this._dbService.getShoppingItems()
    res.forEach(elem => {
      let tmp = ShoppingItemMapper.ConvertToDalFromJson(elem);
      this.shoppingItems.push(ShoppingItemMapper.ConvertToEntity(tmp, SharedService.users));
    });
    console.log(this.shoppingItems)
    this.filteredShoppingItems = this.shoppingItems;
    this.loadedShopping = true;
  }

  async addShoppingItem(item: ShoppingItem) {
    if (!SharedService.isNullOrWhiteSpace(item.Name) && item.User != null && item.Category != "") {
      await this._dbService.addShoppingItem(ShoppingItemMapper.ConvertToDal(item))
      await this.getShoppingItems();
      this.filtering(this.userFilter,this.categoryFilter);
      this.name = "";
    }
  }

  async removeShoppingItem(item: ShoppingItem) {
    //console.log(item)
    await this._dbService.removeShoppingItem(item.ID)
    this.getShoppingItems();
  }
}
