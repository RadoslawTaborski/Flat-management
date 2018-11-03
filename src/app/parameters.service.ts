import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  static AppName="Beeeema"
  static ApiUrl="http://localhost/bemaapi.php/";
  static FooterText="© Bema - Radosław Taborski - 2018"

  //static TitleName="Bema";
  //static theme="united" //both of this parameters can to change in index.html head

  //also it is necessary clone php api and database.sql script (change databese name in both)

  constructor() { }
}
