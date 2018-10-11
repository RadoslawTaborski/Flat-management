import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { DbService } from '../db.service';
import { User } from '../models/user';
import { Cleaner } from '../models/cleaner';
import { Cleaning } from '../models/cleaning';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  providers: [ DbService ],
  styleUrls: ['./cleaning.component.css']
})
export class CleaningComponent implements OnInit {
  cleaners: Cleaner[] =[];
  cleaning: Cleaning[] =[]
  
  constructor(private _dbService: DbService) { }

  ngOnInit() {
  }

}
