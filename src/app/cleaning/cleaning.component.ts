import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { DbService } from '../db.service';
import { User, UserMapper } from '../models/user';
import { Cleaner, CleanerMapper } from '../models/cleaner';
import { Cleaning, CleaningMapper } from '../models/cleaning';

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
  filteredCleaning: Cleaning[] = [];
  submitError: boolean;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.loadedCleaning = false;
    if (this.cleaners.length == 0) {
      this.getData();
    } else {
      this.getCleaners();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  addCleaning(item: Cleaner) {
    let tmp = new Cleaning(0, item, "");
    this._dbService.addCleaning(CleaningMapper.ConvertToDal(tmp))
      .subscribe(res => { this.getCleaners(); }, err => { this.submitError = true; })
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  getData() {
    SharedService.users = [];
    this._dbService.getUsers()
      .subscribe((res: any[]) => {
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
        this.getCleaners();
      })
  }

  getCleaners() {
    this.cleaners = [];
    this._dbService.getCleaners()
      .subscribe((res: any[]) => {
        res.forEach(elem => {
          let tmp = CleanerMapper.ConvertToDalFromJson(elem);
          this.cleaners.push(CleanerMapper.ConvertToEntity(tmp, SharedService.users));
        });
        console.log(this.cleaners)
        this.getCleaning();
        this.cleaners = this.cleaners.sort((a, b) => (a.Counter > b.Counter) ? 1 : ((b.Counter > a.Counter) ? -1 : (a.LastTimeOfCleaning > b.LastTimeOfCleaning) ? 1 : -1));
        this.loadedCleaning = true;
      })
  }

  getCleaning() {
    this.cleaning = [];
    this.filteredCleaning = [];
    this._dbService.getCleaning()
      .subscribe((res: any[]) => {
        res.forEach(elem => {
          let tmp = CleaningMapper.ConvertToDalFromJson(elem);
          this.cleaning.push(CleaningMapper.ConvertToEntity(tmp, this.cleaners));
        });
        console.log(this.cleaning)
        this.filteredCleaning = this.cleaning;
        this.loadedCleaning = true;
      })
  }

}
