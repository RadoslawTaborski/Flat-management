import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { DbService } from '../db.service';
import { User, UserMapper } from '../models/user';
import { Cleaner, CleanerMapper } from '../models/cleaner';
import { Cleaning, CleaningMapper } from '../models/cleaning';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  providers: [DbService],
  styleUrls: ['./cleaning.component.css']
})
export class CleaningComponent implements OnInit {
  cleaners: Cleaner[] = [];
  cleaning: Cleaning[] = []
  loadedCleaning: boolean = false;
  loadedUsers: boolean = false;
  loadedCleaners: boolean = false;
  filteredCleaning: Cleaning[] = [];
  submitError: boolean;

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
    this.loadedCleaning = false;
    if (this.cleaners.length == 0) {
      await this.getData();
    }
    await this.getCleaners();
    await this.getCleaning();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////

  async getData() {
    SharedService.users = [];
    let res = await this._dbService.getUsers();
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

  async getCleaners() {
    this.cleaners = [];
    let res = await this._dbService.getCleaners();
    res.forEach(elem => {
      let tmp = CleanerMapper.ConvertToDalFromJson(elem);
      this.cleaners.push(CleanerMapper.ConvertToEntity(tmp, SharedService.users));
    });
    console.log(this.cleaners)
    this.cleaners = this.cleaners.sort((a, b) => (a.Counter > b.Counter) ? 1 : ((b.Counter > a.Counter) ? -1 : (a.LastTimeOfCleaning > b.LastTimeOfCleaning) ? 1 : -1));
    this.loadedCleaners = true;
  }

  async getCleaning() {
    this.cleaning = [];
    this.filteredCleaning = [];
    let res = await this._dbService.getCleaning()
    res.forEach(elem => {
      let tmp = CleaningMapper.ConvertToDalFromJson(elem);
      this.cleaning.push(CleaningMapper.ConvertToEntity(tmp, this.cleaners));
    });
    console.log(this.cleaning)
    this.filteredCleaning = this.cleaning;
    this.loadedCleaning = true;
  }

  async addCleaning(item: Cleaner) {
    let tmp = new Cleaning(0, item, "");
    await this._dbService.addCleaning(CleaningMapper.ConvertToDal(tmp));
    this.getCleaners();
  }

}
