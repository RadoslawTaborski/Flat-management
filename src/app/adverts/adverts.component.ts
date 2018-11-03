import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SharedService } from '../shared.service';
import { User, UserMapper } from '../models/user';
import { Advert, AdvertMapper } from '../models/adverts';

@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.component.html',
  styleUrls: ['./adverts.component.css']
})
export class AdvertsComponent implements OnInit {

  text: string;
  endDate: string;
  userID: number = 1;
  add=false;
  noDateDetails: boolean[]=[];
  dateDetails: boolean[]=[];
  tab:boolean[]=[true,false];

  adverts: Advert[] = [];
  filteredAdverts: Advert[] = [];
  noDateAdverts: Advert[] = [];
  dateAdverts: Advert[] = [];
  newShoppingItem: Advert = null;

  submitError: boolean = false;
  loadedAdverts: boolean = false;
  loadedUsers: boolean = false;

  deviceInfo= null;
  isMobile = false;
  isDesktop = false;
  isTablet = false;

  constructor(private _dbService: DbService, private deviceService: DeviceDetectorService) { }

  public detectDevice(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile=this.deviceService.isMobile();
    this.isDesktop=this.deviceService.isDesktop();
    this.isTablet=this.deviceService.isTablet();
  }
  async ngOnInit() {
    this.detectDevice();
    this.loadedAdverts = false;
    if (SharedService.users.length == 0) {
      await this.getData();
    }
    await this.getAdverts();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  getUserByID(id: number): User {
    //console.log(id)
    var a = SharedService.users.filter(x => x.ID == id)[0];
    //console.log(SharedService.users)
    return a;
  }

  setAdd(){
    this.add=!this.add;
  }

  getUsersItems(): User[] {
    return SharedService.users;
  }

  createAdvert(user: number, text: string, endDate: string): Advert {
    //console.log(user,name,category)
    return new Advert(0, text, this.getUserByID(user), "", endDate==null?"NULL":endDate);
  }

  sortAdvents(){
    this.noDateAdverts=[];
    this.dateAdverts=[];
    this.noDateDetails=[];
    this.dateDetails=[];
    this.filteredAdverts.forEach(elem => {
      if(elem.EndDate == null || elem.EndDate=="0000-00-00 00:00:00"){
        this.noDateAdverts.push(elem);
        this.noDateDetails.push(false);
      }else{
        this.dateAdverts.push(elem);
        this.dateDetails.push(false);
      }
    })
  }

  getNoDateDetails(i: number){
    this.noDateDetails[i]=!this.noDateDetails[i];
  }

  getDateDetails(i: number){
    this.dateDetails[i]=!this.dateDetails[i];
  }

  changeTab(i: number){
    for(let j=0; j<this.tab.length; j++){
      this.tab[j]=false;
    }
    this.tab[i]=true;
    console.log(this.tab)
  }

  shortenDate(date: string): string{
    let result = date;
    result=result.substring(0,result.length-3);
    result=result.replace(" 00:00","");
    console.log(result);
    return result;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  async getData() {
    SharedService.users = [];
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

  async getAdverts() {
    this.adverts = [];
    this.filteredAdverts = [];
    let res = await this._dbService.getAdverts();
    res.forEach(elem => {
      let tmp = AdvertMapper.ConvertToDalFromJson(elem);
      this.adverts.push(AdvertMapper.ConvertToEntity(tmp, SharedService.users));
    });
    console.log(this.adverts)
    this.filteredAdverts = this.adverts;
    this.sortAdvents();
    this.loadedAdverts = true;
  }

  async addAdvert(item: Advert) {
    console.log(item);
    if (!SharedService.isNullOrWhiteSpace(item.Text) && item.User != null) {
      await this._dbService.addAdvert(AdvertMapper.ConvertToDal(item))
      await this.getAdverts();
      this.text = "";
      this.endDate="";
    }
  }

  async removeAdvert(item: Advert) {
    //console.log(item)
    await this._dbService.removeAdvert(item.ID)
    this.getAdverts();
  }
}
