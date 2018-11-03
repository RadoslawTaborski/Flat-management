import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { DbService } from '../db.service';
import { User, UserMapper } from '../models/user';
import { Cleaner, CleanerMapper } from '../models/cleaner';
import { Cleaning, CleaningMapper } from '../models/cleaning';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';
import { DaysOfWeek } from '../models/day.of.week';

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
  delay: number = 0;
  date: string = "";
  date2: string = "";
  submitError: boolean;
  user: boolean[] = [];
  currentDate: Date;

  deviceInfo = null;
  isMobile = false;
  isDesktop = false;
  isTablet = false;

  constructor(private _dbService: DbService, private deviceService: DeviceDetectorService) { }

  public detectDevice() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
  }

  async ngOnInit() {
    this.detectDevice();
    this.loadedCleaning = false;
    if (this.cleaners.length == 0) {
      await this.getData();
    }
    await this.setDateOfNextCleaning();
    await this.getCleaners();
    await this.getCleaning();
    SharedService.users.forEach(element => {
      this.user.push(false);
    });
    this.currentDate = new Date();
    var datePipe = new DatePipe("en-US");
    this.date = datePipe.transform(this.currentDate, 'dd.MM.yyyy');
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  getNextCleaners(): Cleaner[] {
    let result: Cleaner[] = [];
    if (this.cleaners.length > 0) {
      let counter = this.cleaners[0].Counter;
      let date = this.cleaners[0].LastTimeOfCleaning;

      this.cleaners.forEach(element => {
        if (element.Counter == counter && date == element.LastTimeOfCleaning) {
          result.push(element);
        }
      });
    }
    return result;
  }

  getNextCleanersString(): string {
    let cleaners = this.getNextCleaners();
    let result = "";
    cleaners.forEach(element => {
      result += element.User.Login + " lub ";
    });
    result = result.substring(0, result.length - 5);
    return result;
  }

  getDetails(i: number) {
    if (!this.user[i]) {
      for (let j = 0; j < this.user.length; j++) {
        this.user[j] = false;
      }
    }
    this.user[i] = !this.user[i];
  }

  getDayOfWeek(date: string): string {
    let result = ""
    let newDate = new Date(date);
    result = DaysOfWeek[newDate.getDay()];
    return result;
  }

  changeDateFormatToPL(date: string): string {
    let result = "";
    var datePipe = new DatePipe("en-US");
    result = datePipe.transform(new Date(date), 'dd.MM.yyyy');
    return result;
  }

  changeDateFormatToSQL(date: string): string {
    let result = ""
    let tmp=date.split(".",3);
    tmp=tmp.reverse();
    let newDate = new Date(tmp.join("-"))
    var datePipe = new DatePipe("en-US");
    result = datePipe.transform(newDate, 'yyyy-MM-dd');
    //console.log(result)
    return result;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  async getData() {
    SharedService.users = [];
    let res = await this._dbService.getUsers();
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

  async getCleaners() {
    this.cleaners = [];
    let res = await this._dbService.getCleaners();
    res.forEach(elem => {
      let tmp = CleanerMapper.ConvertToDalFromJson(elem);
      this.cleaners.push(CleanerMapper.ConvertToEntity(tmp, SharedService.users));
    });
    //console.log(this.cleaners)
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
    //console.log(this.cleaning)
    this.filteredCleaning = this.cleaning;
    this.loadedCleaning = true;
  }

  async addCleaning(item: Cleaner, date: string) {
    let tmp = new Cleaning(0, item, date);
    await this._dbService.addCleaning(CleaningMapper.ConvertToDal(tmp));
    this.getCleaners();
    this.getCleaning();
    this.setDateOfNextCleaning();
    for (let j = 0; j < this.user.length; j++) {
      this.user[j] = false;
    }
  }

  async setDateOfNextCleaning() {
    let res = await this._dbService.getLastCleaningDate();
    if (res[0] == undefined) {
      this.date2 = new Date().toLocaleDateString();
    } else {
      var date = res[0].Date;
      let newDate;
      for (let i = 11; i > 0; i--) {
        newDate = new Date(new Date(date).getTime() + (1000 * 60 * 60 * 24 * i));
        if (newDate.getDay() == 6) {
          //console.log(newDate, newDate.getDay());
          break;
        }
      }
      let currentDate = new Date();
      if (currentDate > newDate) {
        this.delay = Math.floor(Math.abs(currentDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
      }
      this.date2 = newDate.toLocaleDateString() + " (" + DaysOfWeek[newDate.getDay()] + ")";
      //console.log(this.delay);
    }
  }
}
